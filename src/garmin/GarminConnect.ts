import appRoot from 'app-root-path';
import CFClient from '../common/CFClient';
import { toDateString } from '../common/DateUtils';
import * as urls from './Urls';
import { ExportFileType, UploadFileType } from './Urls';
import { CookieJar } from 'tough-cookie';
import {
    GCActivityId,
    GCBadgeId,
    GCUserHash,
    Gear,
    IActivity,
    IActivityDetails,
    IBadge,
    ISocialConnections,
    ISocialProfile,
    IUserInfo
} from './types';
import Running from './workouts/Running';
import path from 'path';
import fs from 'fs';

let config: GCCredentials | undefined = undefined;

try {
    config = appRoot.require('/garmin.config.json');
} catch (e) {
    // Do nothing
}

export type EventCallback<T> = (data: T) => void;

export interface GCCredentials {
    username: string;
    password: string;
}

export interface Listeners {
    [event: string]: EventCallback<any>[];
}

export enum Event {
    sessionChange = 'sessionChange'
}

export interface Session {
    cookies: CookieJar.Serialized | undefined;
    userHash: string | undefined;
}

export default class GarminConnect {
    private client: CFClient;
    private _userHash: GCUserHash | undefined;
    private credentials: GCCredentials;
    private listeners: Listeners;

    constructor(credentials: GCCredentials | undefined = config) {
        const headers = {
            origin: urls.GARMIN_SSO_ORIGIN,
            nk: 'NT'
        };
        this.client = new CFClient(headers);
        this._userHash = undefined;
        if (!credentials) {
            throw new Error('Missing credentials');
        }
        this.credentials = credentials;
        this.listeners = {};
    }

    get userHash(): GCUserHash {
        if (!this._userHash) {
            throw new Error('User not logged in');
        }
        return this._userHash;
    }

    get sessionJson(): Session {
        const cookies = this.client.serializeCookies();
        return { cookies, userHash: this._userHash };
    }

    set sessionJson(json: Session) {
        const { cookies, userHash } = json || {};
        if (cookies && userHash) {
            this._userHash = userHash;
            this.client.importCookies(cookies);
        }
    }

    /**
     * Add an event listener callback
     * @param event
     * @param callback
     */
    on<T>(event: Event, callback: EventCallback<T>) {
        if (
            event &&
            callback &&
            typeof event === 'string' &&
            typeof callback === 'function'
        ) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        }
    }

    /**
     * Method for triggering any event
     * @param event
     * @param data
     */
    triggerEvent<T>(event: Event, data: T) {
        const callbacks = this.listeners[event] || [];
        callbacks.forEach((cb) => cb(data));
    }

    /**
     * Add a callback to the 'sessionChange' event
     * @param callback
     */
    onSessionChange(callback: EventCallback<Session>) {
        this.on<Session>(Event.sessionChange, callback);
    }

    /**
     * Restore an old session from storage and fallback to regular login
     * @param json
     * @param username
     * @param password
     * @returns {Promise<GarminConnect>}
     */
    async restoreOrLogin(json: Session, username: string, password: string) {
        return this.restore(json).catch((e) => {
            console.warn(e);
            return this.login(username, password);
        });
    }

    /**
     * Restore an old session from storage
     * @param json
     * @returns {Promise<GarminConnect>}
     */
    async restore(json: Session) {
        this.sessionJson = json;
        try {
            const info = await this.getUserInfo();
            const { displayName } = info || {};
            if (displayName && displayName === this.userHash) {
                // Session restoration was successful
                return this;
            }
            throw new Error(
                'Unable to restore session, user hash do not match'
            );
        } catch (e) {
            throw new Error(`Unable to restore session due to: ${e}`);
        }
    }

    /**
     * Login to Garmin Connect
     * @param username
     * @param password
     * @returns {Promise<*>}
     */
    async login(username?: string, password?: string): Promise<GarminConnect> {
        if (username && password) {
            this.credentials.username = username;
            this.credentials.password = password;
        }
        let tempCredentials = {
            ...this.credentials,
            rememberme: 'on',
            embed: 'false'
        };
        await this.client.get(urls.SIGNIN_URL);
        await this.client.post(urls.SIGNIN_URL, tempCredentials);
        const userPreferences = await this.getUserInfo();
        const { displayName } = userPreferences;
        this._userHash = displayName;
        return this;
    }

    // User info
    /**
     * Get basic user information
     * @returns {Promise<*>}
     */
    async getUserInfo(): Promise<IUserInfo> {
        return this.get<IUserInfo>(urls.userInfo());
    }

    /**
     * Get social user information
     * @returns {Promise<*>}
     */
    async getSocialProfile(): Promise<ISocialProfile> {
        return this.get<ISocialProfile>(urls.socialProfile(this.userHash));
    }

    /**
     * Get a list of all social connections
     * @returns {Promise<*>}
     */
    async getSocialConnections(): Promise<ISocialConnections> {
        return this.get<ISocialConnections>(
            urls.socialConnections(this.userHash)
        );
    }

    // Devices
    /**
     * Get a list of all registered devices
     * @returns {Promise<*>}
     */
    async getDeviceInfo() {
        return this.get(urls.deviceInfo(this.userHash));
    }

    // Sleep data
    /**
     * Get detailed sleep data for a specific date
     * @param date
     * @returns {Promise<*>}
     */
    async getSleepData(date = new Date()) {
        const dateString = toDateString(date);
        return this.get(urls.dailySleepData(this.userHash), {
            date: dateString
        });
    }

    /**
     * Get sleep data summary for a specific date
     * @param date
     * @returns {Promise<*>}
     */
    async getSleep(date = new Date()) {
        const dateString = toDateString(date);
        return this.get(urls.dailySleep(), { date: dateString });
    }

    // Heart rate
    /**
     * Get heart rate measurements for a specific date
     * @param date
     * @returns {Promise<*>}
     */
    async getHeartRate(date = new Date()) {
        const dateString = toDateString(date);
        return this.get(urls.dailyHeartRate(this.userHash), {
            date: dateString
        });
    }

    // Weight
    /**
     * Post a new body weight
     * @param weight
     * @returns {Promise<*>}
     */
    async setBodyWeight(weight: number) {
        if (weight) {
            const roundWeight = Math.round(weight * 1000);
            const data = { userData: { weight: roundWeight } };
            return this.put(urls.userSettings(), data);
        }
        return Promise.reject();
    }

    // Activites
    /**
     * Get list of activites
     * @param start
     * @param limit
     * @returns {Promise<*>}
     */
    async getActivities(start: number, limit: number): Promise<IActivity[]> {
        return this.get<IActivity[]>(urls.activities(), { start, limit });
    }

    /**
     * Get details about an activity
     * @param activityId
     * @returns {Promise<IActivityDetails>}
     */
    async getActivityDetails(
        activityId: GCActivityId
    ): Promise<IActivityDetails> {
        if (activityId) {
            return this.get(urls.activity(activityId));
        }
        return Promise.reject();
    }

    /**
     * Get metrics details about an activity
     * @param activity
     * @param maxChartSize
     * @param maxPolylineSize
     * @returns {Promise<*>}
     */
    async getActivity(
        activity: { activityId: GCActivityId },
        maxChartSize: number,
        maxPolylineSize: number
    ) {
        const { activityId } = activity || {};
        if (activityId) {
            return this.get(urls.activityDetails(activityId), {
                maxChartSize,
                maxPolylineSize
            });
        }
        return Promise.reject();
    }

    /**
     * Get weather data from an activity
     * @param activity
     * @returns {Promise<*>}
     */
    async getActivityWeather(activity: { activityId: GCActivityId }) {
        const { activityId } = activity || {};
        if (activityId) {
            return this.get(urls.weather(activityId));
        }
        return Promise.reject();
    }

    /**
     * Updates an activity
     * @param activity
     * @returns {Promise<*>}
     */
    async updateActivity(activity: { activityId: GCActivityId }) {
        return this.put(urls.activity(activity.activityId), activity);
    }

    /**
     * Deletes an activity
     * @param activity
     * @returns {Promise<*>}
     */
    async deleteActivity(activity: { activityId: GCActivityId }) {
        const { activityId } = activity || {};
        if (activityId) {
            const headers = { 'x-http-method-override': 'DELETE' };
            return this.client.postJson(
                urls.activity(activityId),
                undefined,
                headers
            );
        }
        return Promise.reject();
    }

    /**
     * Get list of activities in your news feed
     * @param start
     * @param limit
     * @returns {Promise<*>}
     */
    async getNewsFeed(start: number, limit: number) {
        return this.get(urls.newsFeed(), { start, limit });
    }

    // Steps
    /**
     * Get step count for a specific date
     * @param date
     * @returns {Promise<*>}
     */
    async getSteps(date = new Date()) {
        const dateString = toDateString(date);
        return this.get(urls.dailySummaryChart(this.userHash), {
            date: dateString
        });
    }

    // Workouts
    /**
     * Get list of workouts
     * @param start
     * @param limit
     * @returns {Promise<*>}
     */
    async getWorkouts(start: number, limit: number) {
        return this.get(urls.workouts(), { start, limit });
    }

    /**
     * Download original activity data to disk as zip
     * Resolves to absolute path for the downloaded file
     * @param activity : any
     * @param dir Will default to current working directory
     * @param type : string - Will default to 'zip'. Other possible values are 'tcx', 'gpx' or 'kml'.
     * @returns {Promise<*>}
     */
    async downloadOriginalActivityData(
        activity: { activityId: GCActivityId },
        dir: string,
        type?: ExportFileType
    ) {
        const { activityId } = activity || {};
        if (activityId) {
            const url =
                !type || type === ExportFileType.zip
                    ? urls.originalFile(activityId)
                    : urls.exportFile(activityId, type);
            return this.client.downloadBlob(dir, url);
        }
        return Promise.reject();
    }

    /**
     * Uploads an activity file ('gpx', 'tcx', or 'fit')
     * @param file the file to upload
     * @param format the format of the file. If undefined, the extension of the file will be used.
     * @returns {Promise<*>}
     */
    async uploadActivity(file: string, format: UploadFileType) {
        const detectedFormat = (format || path.extname(file))?.toLowerCase();
        const filename = path.basename(file);

        if ((<any>Object).values(UploadFileType).includes(detectedFormat)) {
            return Promise.reject();
        }

        const fileBuffer = fs.readFileSync(file);
        const response = this.client.post(urls.upload(format), {
            userfile: {
                value: fileBuffer,
                options: {
                    filename
                }
            }
        });
        return response;
    }

    /**
     * Adds a running workout with one step of completeing a set distance.
     * @param name
     * @param meters
     * @param description
     * @returns {Promise<*>}
     */
    async addRunningWorkout(name: string, meters: number, description: string) {
        const running = new Running();
        running.name = name;
        running.distance = meters;
        running.description = description;
        return this.addWorkout(running);
    }

    /**
     * Add a new workout preset.
     * @param workout
     * @returns {Promise<*>}
     */
    async addWorkout(workout: any) {
        if (workout.isValid()) {
            const data = { ...workout.toJson() };
            if (!data.description) {
                data.description = 'Added by garmin-connect for Node.js';
            }
            return this.post(urls.workout(), data);
        }
        return Promise.reject();
    }

    /**
     * Add a workout to your workout calendar.
     * @param workout
     * @param date
     * @returns {Promise<*>}
     */
    async scheduleWorkout(workout: any, date: Date) {
        const { workoutId } = workout || {};
        if (workoutId && date) {
            const dateString = toDateString(date);
            return this.post(urls.schedule(workoutId), { date: dateString });
        }
        return Promise.reject();
    }

    /**
     * Delete a workout based on a workout object.
     * @param workout
     * @returns {Promise<*>}
     */
    async deleteWorkout(workout: any) {
        const { workoutId } = workout || {};
        if (workoutId) {
            const headers = { 'x-http-method-override': 'DELETE' };
            return this.client.postJson(
                urls.workout(workoutId),
                undefined,
                headers
            );
        }
        return Promise.reject();
    }

    // Badges
    /**
     * Get list of earned badges
     * @returns {Promise<*>}
     */
    async getBadgesEarned(): Promise<IBadge[]> {
        return this.get<IBadge[]>(urls.badgesEarned());
    }

    /**
     * Get list of available badges
     * @returns {Promise<*>}
     */
    async getBadgesAvailable(): Promise<IBadge[]> {
        return this.get<IBadge[]>(urls.badgesAvailable());
    }

    /**
     * Get details about an badge
     * @param badge
     * @returns {Promise<*>}
     */
    async getBadge(badge: { badgeId: GCBadgeId }) {
        const { badgeId } = badge || {};
        if (badgeId) {
            return this.get(urls.badgeDetail(badgeId));
        }
        return Promise.reject();
    }

    /**
     * Uploads an image to an activity
     * @param activity
     * @param file the file to upload
     * @returns {Promise<*>}
     */
    async uploadImage(activity: { activityId: GCActivityId }, file: string) {
        return this.client.post(urls.image(activity.activityId), {
            file: {
                value: fs.readFileSync(file),
                options: {
                    filename: path.basename(file)
                }
            }
        });
    }

    /**
     * Delete an image from an activity
     * @param activity
     * @param imageId, can be found in `activityImages` array of the activity
     * @returns {Promise<void>}
     */
    async deleteImage(
        activity: { activityId: GCActivityId },
        imageId: string
    ): Promise<void> {
        return this.client.delete(
            urls.imageDelete(activity.activityId, imageId)
        );
    }

    /**
     * List the gear available at a certain date
     * @param userProfilePk, user profile private key (can be found in user or activity details)
     * @param availableGearDate, list gear available at this date only
     * @returns {Promise<void>}
     */
    async listGear(
        userProfilePk: number,
        availableGearDate?: Date
    ): Promise<Gear[]> {
        return this.client.get(urls.listGear(userProfilePk, availableGearDate));
    }

    // General methods

    async get<T>(url: string, data?: any) {
        const response = await this.client.get(url, data);
        this.triggerEvent(Event.sessionChange, this.sessionJson);
        return response as T;
    }

    async post<T>(url: string, data: any) {
        const response = await this.client.postJson<T>(url, data, {});
        this.triggerEvent(Event.sessionChange, this.sessionJson);
        return response as T;
    }

    async put<T>(url: string, data: any) {
        const response = await this.client.putJson<T>(url, data);
        this.triggerEvent(Event.sessionChange, this.sessionJson);
        return response as T;
    }
}

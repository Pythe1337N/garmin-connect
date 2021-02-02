const appRoot = require('app-root-path');
const path = require('path');
const FormData = require('form-data');
const fs = require('fs');

let config = {};
try {
    // eslint-disable-next-line
    config = require(`${appRoot}/garmin.config.json`);
} catch (e) {
    // Do nothing
}

const Client = require('../common/Client');
const { Running } = require('./workouts');
const { toDateString } = require('../common/DateUtils');
const urls = require('./Urls');

const {
    username: configUsername,
    password: configPassword,
} = config;

const credentials = {
    username: configUsername,
    password: configPassword,
    embed: true,
    _eventId: 'submit',
};

const params = {
    service: urls.GC_MODERN,
    clientId: 'GarminConnect',
    gauthHost: urls.GARMIN_SSO,
    consumeServiceTicket: false,
};

class GarminConnect {
    constructor() {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
            Referer: 'https://connect.garmin.com/modern/dashboard/',
            origin: 'https://sso.garmin.com',
            nk: 'NT',
        };
        this.client = new Client(headers);
        this.userHash = undefined;
    }

    /**
     * Login to Garmin Connect
     * @param username
     * @param password
     * @returns {Promise<*>}
     */
    async login(username, password) {
        let tempCredentials = { ...credentials };
        if (username && password) {
            tempCredentials = { ...credentials, username, password };
        }
        await this.client.get(urls.SIGNIN_URL, {}, params);
        await this.client.post(urls.LOGIN_URL, tempCredentials, params);
        await this.client.get(urls.GC_MODERN);
        const userPreferences = await this.getUserInfo();
        const { displayName } = userPreferences;
        this.userHash = displayName;
        return this;
    }

    // User info
    /**
     * Get basic user information
     * @returns {Promise<*>}
     */
    async getUserInfo() {
        return this.get(urls.userInfo());
    }

    /**
     * Get social user information
     * @returns {Promise<*>}
     */
    async getSocialProfile() {
        return this.get(urls.socialProfile(this.userHash));
    }

    /**
     * Get a list of all social connections
     * @returns {Promise<*>}
     */
    async getSocialConnections() {
        return this.get(urls.socialConnections(this.userHash));
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
        return this.get(urls.dailySleepData(this.userHash), { date: dateString });
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
        return this.get(urls.dailyHeartRate(this.userHash), { date: dateString });
    }

    // Weight
    /**
     * Post a new body weight
     * @param weight
     * @returns {Promise<*>}
     */
    async setBodyWeight(weight) {
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
    async getActivities(start, limit) {
        return this.get(urls.activities(), { start, limit });
    }

    /**
     * Get details about an activity
     * @param activity
     * @param maxChartSize
     * @param maxPolylineSize
     * @returns {Promise<*>}
     */
    async getActivity(activity, maxChartSize, maxPolylineSize) {
        const { activityId } = activity || {};
        if (activityId) {
            return this.get(urls.activity(activityId), { maxChartSize, maxPolylineSize });
        }
        return Promise.reject();
    }

    /**
     * Get list of activities in your news feed
     * @param start
     * @param limit
     * @returns {Promise<*>}
     */
    async getNewsFeed(start, limit) {
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
        return this.get(urls.dailySummaryChart(this.userHash), { date: dateString });
    }

    // Workouts
    /**
     * Get list of workouts
     * @param start
     * @param limit
     * @returns {Promise<*>}
     */
    async getWorkouts(start, limit) {
        return this.get(urls.workouts(), { start, limit });
    }

    /**
     * Download original activity data to disk as zip
     * Resolves to absolute path for the downloaded file
     * @param activity
     * @param dir Will default to current working directory
     * @returns {Promise<*>}
     */
    async downloadOriginalActivityData(activity, dir) {
        const { activityId } = activity || {};
        if (activityId) {
            return this.client.downloadBlob(dir, urls.originalFile(activityId));
        }
        return Promise.reject();
    }

    /**
     * Uploads an activity file ('gpx', 'tcx', or 'fit')
     * @param file the file to upload
     * @param format the format of the file. If undefined, the extension of the file will be used.
     * @returns {Promise<*>}
     */
    async uploadActivity(file, format) {
        format = format || path.extname(file);
        if (format !== '.gpx' && format !== '.tcx' && format !== '.fit') {
            Promise.reject();
        }

        var formData = new FormData();
        formData.append(path.basename(file), fs.createReadStream(file));
        return this.client.postBlob(urls.upload(format), formData);
    }

    /**
     * Adds a running workout with one step of completeing a set distance.
     * @param name
     * @param meters
     * @param description
     * @returns {Promise<*>}
     */
    async addRunningWorkout(name, meters, description) {
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
    async addWorkout(workout) {
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
    async scheduleWorkout(workout, date) {
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
    async deleteWorkout(workout) {
        const { workoutId } = workout || {};
        if (workoutId) {
            const headers = { 'x-http-method-override': 'DELETE' };
            return this.client.postJson(urls.workout(workoutId), undefined, undefined, headers);
        }
        return Promise.reject();
    }

    // General methods

    async get(url, data) {
        return this.client.get(url, data);
    }

    async post(url, data) {
        return this.client.postJson(url, data);
    }

    async put(url, data) {
        return this.client.putJson(url, data);
    }
}

module.exports = GarminConnect;

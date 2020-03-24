const appRoot = require('app-root-path');

// eslint-disable-next-line import/no-dynamic-require
const config = require(`${appRoot}/garmin.config.json`);
const Client = require('../common/Client');
const { Running } = require('./workouts');
const { toDateString } = require('../common/DateUtils');
const urls = require('./Urls');

const {
    username,
    password,
} = config;

const credentials = {
    username,
    password,
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
     * @param date
     * @returns {Promise<*>}
     */
    async login() {
        await this.client.get(urls.SIGNIN_URL, {}, params);
        await this.client.post(urls.LOGIN_URL, credentials, params);
        await this.client.get(urls.GC_MODERN);
        const userPreferences = this.getUserInfo();
        const { displayName } = userPreferences;
        this.userHash = displayName;
        return this;
    }

    // User info
    /**
     * Get basic user information
     * @param date
     * @returns {Promise<*>}
     */
    async getUserInfo() {
        return this.get(urls.userInfo());
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
     * @param workoutId
     * @param date
     * @returns {Promise<*>}
     */
    async scheduleWorkout(workoutId, date) {
        if (workoutId && date) {
            const dateString = toDateString(date);
            return this.post(urls.schedule(workoutId), { date: dateString });
        }
        return Promise.reject();
    }

    /**
     * Delete a workout based on a workoutId.
     * @param workoutId
     * @returns {Promise<*>}
     */
    async deleteWorkout(workoutId) {
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

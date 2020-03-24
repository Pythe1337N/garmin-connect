const Client = require('../common/Client');
const { toDateString } = require('../common/DateUtils');
const appRoot = require('app-root-path');
const config = require(appRoot + '/garmin.config.json');
const urls = require('./Urls');

const {
    username,
    password
} = config;

const credentials = {
    username,
    password,
    embed:true,
    _eventId:'submit'
};

const params = {
    service: urls.GC_MODERN,
    clientId: 'GarminConnect',
    gauthHost: urls.GARMIN_SSO,
    consumeServiceTicket: false
};

class GarminConnect {
    constructor() {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
            'Referer': "https://connect.garmin.com/modern/dashboard/",
            'origin': 'https://sso.garmin.com',
            'nk': 'NT'
        };
        this.client = new Client(headers);
        this.userHash;
    }

    async login() {
        await this.client.get(urls.SIGNIN_URL, {}, params);
        await this.client.post(urls.LOGIN_URL, credentials, params);
        await this.client.get(urls.GC_MODERN);
        const userPreferences = this.getUserInfo();
        const { displayName } = userPreferences;
        this.userHash = displayName;
        return this;
    }

    async getUserInfo() {
        return this.client.get(urls.userInfo());
    }

    async getHeartRate(date = new Date()) {
        const dateString = toDateString(date);
        return this.client.get(urls.dailyHeartRate(this.userHash), { date: dateString });
    }

    async setBodyWeight(weight) {
        if (weight) {
            const roundWeight = Math.round(weight * 1000);
            const data = { userData: { weight: roundWeight } };
            return this.client.putJson(urls.userSettings(), data);
        }
        return Promise.reject();
    }

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

const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const path = require('path');

const pipeline = util.promisify(stream.pipeline);

class Client {
    constructor(headers) {
        this.axios = axios;
        this.queryString = qs;
        this.fs = fs;
        this.headers = headers || {};
        this.cookies = {};
    }

    setCookie(name, value) {
        this.cookies[name] = value;
        this.headers.Cookie = this.getCookieString();
    }

    parseCookies(response) {
        const setCookies = response && response.headers && response.headers['set-cookie'];
        if (setCookies) {
            setCookies.forEach((c) => {
                const [cookieValue] = c.split(';');
                const [name, value] = cookieValue.split('=');
                this.setCookie(name, value);
            });
        }
        return response;
    }

    getCookie(name) {
        return this.cookies[name];
    }

    getCookieString() {
        return Object.entries(this.cookies).map((e) => `${e[0]}=${e[1]}`).join('; ');
    }

    post(url, data, params) {
        return this.axios({
            method: 'POST',
            params,
            url,
            data: this.queryString.stringify(data),
            headers: {
                ...this.headers,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            maxRedirects: 0,
        })
            .catch((r) => {
                const { response } = r || {};
                this.parseCookies(response);
                if (response.status === 302 || response.status === 301) {
                    if (response.headers && response.headers.location) {
                        return this.post(response.headers.location, data, params);
                    }
                }
                return r;
            })
            .then((r) => this.parseCookies(r))
            .then((r) => r && r.data);
    }

    postJson(url, data, params, headers = {}) {
        return this.axios({
            method: 'POST',
            params,
            url,
            data: JSON.stringify(data, null, 4),
            headers: {
                ...this.headers,
                ...headers,
                'Content-Type': 'application/json',
            },
        })
            .then((r) => this.parseCookies(r))
            .then((r) => r && r.data);
    }

    postBlob(url, formData, params, headers = {}) {
        return this.axios({
            method: 'POST',
            params,
            url,
            data: formData,
            headers: {
                ...this.headers,
                ...headers,
                ...formData.getHeaders(),
            },
        })
            .then((r) => this.parseCookies(r))
            .then((r) => r && r.data);
    }

    putJson(url, data, params) {
        return this.axios({
            method: 'PUT',
            params,
            url,
            data: JSON.stringify(data, null, 4),
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
        })
            .then((r) => this.parseCookies(r))
            .then((r) => r && r.data);
    }

    downloadBlob(downloadDir = '', url, data, params) {
        const queryData = this.queryString.stringify(data);
        const queryDataString = queryData ? `?${queryData}` : '';
        return this.axios({
            method: 'GET',
            params,
            responseType: 'stream',
            url: `${url}${queryDataString}`,
            headers: this.headers,
            maxRedirects: 0,
        })
            .catch((r) => {
                const { response } = r || {};
                const { status, headers } = response || {};
                const { location } = headers || {};
                this.parseCookies(response);
                if (status === 302 || status === 301) {
                    if (headers && location) {
                        return this.downloadBlob(location, data, params);
                    }
                }
                return r;
            })
            .then((r) => this.parseCookies(r))
            .then(async (r) => {
                const { headers } = r || {};
                const { 'content-disposition': contentDisposition } = headers || {};
                const downloadDirNormalized = path.normalize(downloadDir);
                if (contentDisposition) {
                    const defaultName = `garmin_connect_download_${Date.now()}`;
                    const [, fileName = defaultName] = contentDisposition.match(/filename="(.+)"/);
                    const filePath = path.resolve(downloadDir, fileName);
                    await pipeline(r.data, this.fs.createWriteStream(filePath));
                    return filePath;
                }
                throw new Error(`Could not download file ${url} to ${downloadDirNormalized}`);
            });
    }

    get(url, data, params) {
        const queryData = this.queryString.stringify(data);
        const queryDataString = queryData ? `?${queryData}` : '';
        return this.axios({
            method: 'GET',
            params,
            url: `${url}${queryDataString}`,
            headers: this.headers,
            maxRedirects: 0,
        })
            .catch((r) => {
                const { response } = r || {};
                const { status, headers } = response || {};
                const { location } = headers || {};
                this.parseCookies(response);
                if (status === 302 || status === 301) {
                    if (headers && location) {
                        return this.get(location, data, params);
                    }
                }
                return r;
            })
            .then((r) => this.parseCookies(r))
            .then((r) => {
                if (typeof r === 'string') {
                    return r;
                }
                return r && r.data;
            });
    }
}


module.exports = Client;

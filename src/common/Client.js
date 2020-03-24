const axios = require('axios');
const qs = require('qs');

class Client {
    constructor(headers) {
        this.axios = axios;
        this.queryString = qs;
        this.headers = headers || {};
        this.cookies = {};
    }

    setCookie(name, value) {
        this.cookies[name] = value;
        this.headers['Cookie'] = this.getCookieString();
    }

    parseCookies(response) {
        const setCookies = response && response.headers && response.headers['set-cookie'];
        if (setCookies) {
            setCookies.forEach(c => {
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
        return Object.keys(this.cookies).map(k => k + "=" + this.cookies[k]).join('; ');
    }

    post(url, data, params) {
        return this.axios({
            method: 'POST',
            params: params,
            url: url,
            data: this.queryString.stringify(data),
            headers: {
                ...this.headers,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            maxRedirects: 0,
        })
        .catch((r) => {
            const {response} = r || {};
            this.parseCookies(response);
            if (response.status === 302 || response.status === 301) {
                if (response.headers && response.headers.location) {
                    return this.post(response.headers.location, data, params);
                }
            }
        })
        .then((r) => this.parseCookies(r))
        .then(r => r && r.data);
    }

    postJson(url, data, params, headers = {}) {
        return this.axios({
            method: 'POST',
            params: params,
            url: url,
            data: JSON.stringify(data, null, 4),
            headers: {
                ...this.headers,
                ...headers,
                'Content-Type': 'application/json',
            },
        })
        .then((r) => this.parseCookies(r))
        .then(r => r && r.data);
    }

    putJson(url, data, params) {
        return this.axios({
            method: 'PUT',
            params: params,
            url: url,
            data: JSON.stringify(data, null, 4),
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
        })
        .then((r) => this.parseCookies(r))
        .then(r => r && r.data);
    }

    get(url, data, params) {
        const queryData = this.queryString.stringify(data);
        const queryDataString = queryData && '?' + queryData || '';
        return this.axios({
            method: 'GET',
            params: params,
            url: url + queryDataString,
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
        })
        .then((r) => this.parseCookies(r))
        .then(r => {
            if (typeof r === 'string') {
                return r;
            }
            return r && r.data
        });
    }
}


module.exports = Client;
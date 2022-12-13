import axios, { AxiosRequestHeaders, AxiosResponse, AxiosStatic } from 'axios';
import qs from 'qs';
import fs from 'fs';
import stream from 'stream';
import util from 'util';
import path from 'path';

const pipeline = util.promisify(stream.pipeline);

interface ICookies {
    [key: string]: string;
}

class Client {
    private headers: AxiosRequestHeaders;
    private cookies: ICookies;
    constructor(headers?: AxiosRequestHeaders) {
        this.headers = headers || {};
        this.cookies = {};
    }

    setCookie(name: string, value: string) {
        this.cookies[name] = value;
        this.headers.Cookie = this.getCookieString();
    }

    parseCookies(response: AxiosResponse) {
        const setCookies =
            response && response.headers && response.headers['set-cookie'];
        if (setCookies) {
            setCookies.forEach((c) => {
                const [cookieValue] = c.split(';');
                const [name, value] = cookieValue.split('=');
                this.setCookie(name, value);
            });
        }
        return response;
    }

    getCookie(name: string) {
        return this.cookies[name];
    }

    getCookieString() {
        return Object.entries(this.cookies)
            .map((e) => `${e[0]}=${e[1]}`)
            .join('; ');
    }

    async post<T>(url: string, data: any, params: any): Promise<T> {
        try {
            const response = await axios({
                method: 'POST',
                params,
                url,
                data: qs.stringify(data),
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                maxRedirects: 0
            });
            this.parseCookies(response);
            return response.data as T;
        } catch (e) {
            const response = e as AxiosResponse;
            this.parseCookies(response);
            if (response.status === 302 || response.status === 301) {
                if (response.headers && response.headers.location) {
                    return this.post<T>(
                        response.headers.location,
                        data,
                        params
                    );
                }
            }
            return response.data as T;
        }
    }

    async postJson<T>(
        url: string,
        data: any,
        params: any,
        headers: AxiosRequestHeaders = {}
    ) {
        const response = await axios({
            method: 'POST',
            params,
            url,
            data: JSON.stringify(data, null, 4),
            headers: {
                ...this.headers,
                ...headers,
                'Content-Type': 'application/json'
            }
        });
        this.parseCookies(response);
        return response.data as T;
    }

    async postBlob<T>(
        url: string,
        formData: any,
        params: any,
        headers: AxiosRequestHeaders = {}
    ) {
        const response = await axios({
            method: 'POST',
            params,
            url,
            data: formData,
            headers: {
                ...this.headers,
                ...headers,
                ...formData.getHeaders()
            }
        });
        this.parseCookies(response);
        return response.data as T;
    }

    async putJson<T>(url: string, data: any, params: any) {
        const response = await axios({
            method: 'PUT',
            params,
            url,
            data: JSON.stringify(data, null, 4),
            headers: {
                ...this.headers,
                'Content-Type': 'application/json'
            }
        });
        this.parseCookies(response);
        return response.data as T;
    }

    downloadBlob(downloadDir = '', url: string, data: any, params: any): any {
        const queryData = qs.stringify(data);
        const queryDataString = queryData ? `?${queryData}` : '';
        return axios({
            method: 'GET',
            params,
            responseType: 'stream',
            url: `${url}${queryDataString}`,
            headers: this.headers,
            maxRedirects: 0
        })
            .catch((r) => {
                const { response } = r || {};
                const { status, headers } = response || {};
                const { location } = headers || {};
                this.parseCookies(response);
                if (status === 302 || status === 301) {
                    if (headers && location) {
                        return this.downloadBlob(
                            downloadDir,
                            location,
                            data,
                            params
                        );
                    }
                }
                return r;
            })
            .then((r) => this.parseCookies(r))
            .then(async (r) => {
                const { headers } = r || {};
                const { 'content-disposition': contentDisposition } =
                    headers || {};
                const downloadDirNormalized = path.normalize(downloadDir);
                if (contentDisposition) {
                    const defaultName = `garmin_connect_download_${Date.now()}`;
                    const [, fileName = defaultName] =
                        contentDisposition.match(/filename="(.+)"/) || [];
                    const filePath = path.resolve(downloadDir, fileName);
                    await pipeline(r.data, fs.createWriteStream(filePath));
                    return filePath;
                }
                throw new Error(
                    `Could not download file ${url} to ${downloadDirNormalized}`
                );
            });
    }

    get<T>(url: string, data: any, params: any): Promise<T | string> {
        const queryData = qs.stringify(data);
        const queryDataString = queryData ? `?${queryData}` : '';
        return axios({
            method: 'GET',
            params,
            url: `${url}${queryDataString}`,
            headers: this.headers,
            maxRedirects: 0
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
                return r && (r.data as T);
            });
    }
}

module.exports = Client;

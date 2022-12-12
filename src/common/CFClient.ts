import cloudscraper, { Options, Response } from 'cloudscraper';
import request, { Headers, CookieJar } from 'request';
import { CookieJar as ToughCookieJar } from 'tough-cookie';
import qs from 'qs';
import fs from 'fs';
import path from 'path';

const asJson = <T>(body: string): T => {
    try {
        const jsonBody = JSON.parse(body);
        return jsonBody as T;
    } catch (e) {
        // Do nothing
    }
    return body as T;
};

export default class CFClient {
    private cookies: CookieJar & { _jar?: ToughCookieJar };
    private headers: Headers;

    constructor(headers: Headers) {
        this.cookies = request.jar();
        this.headers = headers || {};
    }

    serializeCookies() {
        return this.cookies._jar?.serializeSync();
    }

    importCookies(cookies: ToughCookieJar.Serialized) {
        const deserialized = ToughCookieJar.deserializeSync(cookies);
        this.cookies = request.jar();
        this.cookies._jar = deserialized;
    }

    async scraper(options: Options): Promise<Response> {
        return new Promise((resolve) => {
            cloudscraper(options, (err, res) => {
                resolve(res);
            });
        });
    }

    /**
     * @param {string} downloadDir
     * @param {string} url
     * @param {*} data
     */
    async downloadBlob(downloadDir = '', url: string, data?: any) {
        const queryData = qs.stringify(data);
        const queryDataString = queryData ? `?${queryData}` : '';
        const options = {
            method: 'GET',
            jar: this.cookies,
            uri: `${url}${queryDataString}`,
            headers: this.headers,
            encoding: null
        } as Options;
        return new Promise((resolve) => {
            cloudscraper(options, async (err, response, body) => {
                const { headers } = response || {};
                const { 'content-disposition': contentDisposition } =
                    headers || {};
                const downloadDirNormalized = path.normalize(downloadDir);
                if (contentDisposition) {
                    const defaultName = `garmin_connect_download_${Date.now()}`;
                    const [, fileName = defaultName] =
                        contentDisposition.match(/filename="?([^"]+)"?/) || [];
                    const filePath = path.resolve(
                        downloadDirNormalized,
                        fileName
                    );
                    fs.writeFileSync(filePath, body);
                    resolve(filePath);
                }
            });
        });
    }

    async get<T>(url: string, data?: any) {
        const queryData = qs.stringify(data);
        const queryDataString = queryData ? `?${queryData}` : '';
        const options = {
            method: 'GET',
            jar: this.cookies,
            uri: `${url}${queryDataString}`,
            headers: this.headers
        } as Options;
        const { body } = await this.scraper(options);
        return asJson<T>(body);
    }

    async post<T>(url: string, data: any) {
        const options = {
            method: 'POST',
            uri: url,
            jar: this.cookies,
            formData: data,
            headers: this.headers
        };
        const { body } = await this.scraper(options);
        return asJson<T>(body);
    }

    async postJson<T>(url: string, data: any, headers: Headers) {
        const options = {
            method: 'POST',
            uri: url,
            jar: this.cookies,
            json: data,
            headers: {
                ...this.headers,
                ...headers,
                'Content-Type': 'application/json'
            }
        };
        const { body } = await this.scraper(options);
        return asJson<T>(body);
    }

    async putJson<T>(url: string, data: any) {
        const options = {
            method: 'PUT',
            uri: url,
            jar: this.cookies,
            json: data,
            headers: {
                ...this.headers,
                'Content-Type': 'application/json'
            }
        };
        const { body } = await this.scraper(options);
        return asJson<T>(body);
    }
}

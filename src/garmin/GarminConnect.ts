import appRoot from 'app-root-path';
import FormData from 'form-data';
import qs from 'qs';
const crypto = require('crypto');
import { HttpClient } from '../common/HttpClient';
import { UrlClass } from './UrlClass';
import {
    GCUserHash,
    GarminDomain,
    IOauth1,
    IOauth1Token,
    IOauth2Token,
    IUserInfo
} from './types';
import OAuth from 'oauth-1.0a';
import { DateTime } from 'luxon';

const CSRF_RE = new RegExp('name="_csrf"\\s+value="(.+?)"');
const TICKET_RE = new RegExp('ticket=([^"]+)"');
const USER_AGENT_CONNECTMOBILE = 'com.garmin.android.apps.connectmobile';
const USER_AGENT_BROWSER =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const OAUTH_CONSUMER = {
    key: 'REPLACE_ME',
    secret: 'REPLACE_ME'
};

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

export interface Session {}

export default class GarminConnect {
    private client: HttpClient;
    private _userHash: GCUserHash | undefined;
    private credentials: GCCredentials;
    private listeners: Listeners;
    private url: UrlClass;
    // private oauth1: OAuth;
    constructor(
        credentials: GCCredentials | undefined = config,
        domain: GarminDomain = 'garmin.com'
    ) {
        if (!credentials) {
            throw new Error('Missing credentials');
        }
        this.url = new UrlClass(domain);
        this.client = new HttpClient();
        this._userHash = undefined;
        this.credentials = credentials;
        this.listeners = {};
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

        // Step1: Set cookie
        const step1Params = {
            clientId: 'GarminConnect',
            locale: 'en',
            service: this.url.GC_MODERN
        };
        const step1Url = `${this.url.GARMIN_SSO_EMBED}?${qs.stringify(
            step1Params
        )}`;
        console.log('login - step1Url:', step1Url);
        await this.client.get(step1Url);

        // Step2 Get _csrf
        const step2Params = {
            id: 'gauth-widget',
            embedWidget: true,
            locale: 'en',
            gauthHost: this.url.GARMIN_SSO_EMBED
        };
        const step2Url = `${this.url.SIGNIN_URL}?${qs.stringify(step2Params)}`;
        console.log('login - step2Url:', step2Url);
        const step2Result = await this.client.get(step2Url);
        // console.log('login - step2Result:', step2Result)
        const csrfRegResult = CSRF_RE.exec(step2Result);
        if (!csrfRegResult) {
            throw new Error('login - csrf not found');
        }
        const csrf_token = csrfRegResult[1];
        console.log('login - csrf:', csrf_token);

        // Step3 Get ticket
        const signinParams = {
            id: 'gauth-widget',
            embedWidget: true,
            clientId: 'GarminConnect',
            locale: 'en',
            gauthHost: this.url.GARMIN_SSO_EMBED,
            service: this.url.GARMIN_SSO_EMBED,
            source: this.url.GARMIN_SSO_EMBED,
            redirectAfterAccountLoginUrl: this.url.GARMIN_SSO_EMBED,
            redirectAfterAccountCreationUrl: this.url.GARMIN_SSO_EMBED
        };
        const step3Url = `${this.url.SIGNIN_URL}?${qs.stringify(signinParams)}`;
        console.log('login - step3Url:', step3Url);
        const step3Form = new FormData();
        step3Form.append('username', this.credentials.username);
        step3Form.append('password', this.credentials.password);
        step3Form.append('embed', 'true');
        step3Form.append('_csrf', csrf_token);
        const step3Result = await this.client.post(step3Url, step3Form, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Dnt: 1,
                Origin: this.url.GARMIN_SSO_ORIGIN,
                Referer: this.url.SIGNIN_URL,
                'User-Agent': USER_AGENT_BROWSER
            }
        });

        const ticketRegResult = TICKET_RE.exec(step3Result);
        if (!ticketRegResult) {
            throw new Error('login - ticket not found');
        }
        const ticket = ticketRegResult[1];
        console.log('login - ticket:', ticket);

        // Step4: Oauth1
        const oauth1 = await this.getOauth1Token(ticket);

        // Step 5: Oauth2
        await this.exchange(oauth1);

        return this;
    }

    async getOauth1Token(ticket: string): Promise<IOauth1> {
        const params = {
            ticket,
            'login-url': this.url.GARMIN_SSO_EMBED,
            'accepts-mfa-tokens': true
        };
        const url = `${this.url.OAUTH_URL}/preauthorized?${qs.stringify(
            params
        )}`;

        const oauth = new OAuth({
            consumer: OAUTH_CONSUMER,
            signature_method: 'HMAC-SHA1',
            hash_function(base_string: string, key: string) {
                return crypto
                    .createHmac('sha1', key)
                    .update(base_string)
                    .digest('base64');
            }
        });

        const step4RequestData = {
            url: url,
            method: 'GET'
        };
        const headers = oauth.toHeader(oauth.authorize(step4RequestData));
        console.log('getOauth1Token - headers:', headers);

        const response = await this.client.get(url, {
            headers: {
                ...headers,
                'User-Agent': USER_AGENT_CONNECTMOBILE
            }
        });
        console.log('getOauth1Token - response:', response);
        const token = qs.parse(response) as unknown as IOauth1Token;
        console.log('getOauth1Token - token:', token);
        this.client.oauth1Token = token;
        return { token, oauth };
    }

    async exchange(oauth1: IOauth1) {
        const token = {
            key: oauth1.token.oauth_token,
            secret: oauth1.token.oauth_token_secret
        };

        const baseUrl = `${this.url.OAUTH_URL}/exchange/user/2.0`;
        const requestData = {
            url: baseUrl,
            method: 'POST',
            data: null
        };

        const step5AuthData = oauth1.oauth.authorize(requestData, token);
        console.log('login - step5AuthData:', step5AuthData);
        const url = `${baseUrl}?${qs.stringify(step5AuthData)}`;
        const response = await this.client.post(url, null, {
            headers: {
                'User-Agent': USER_AGENT_CONNECTMOBILE,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('exchange - response:', response);
        this.client.oauth2Token = this.setOauth2TokenExpiresAt(response);
        this.client.setHeader(
            this.client.oauth2Token.access_token,
            this.url.GC_API
        );

        console.log('exchange - oauth2Token:', this.client.oauth2Token);
    }

    setOauth2TokenExpiresAt(token: IOauth2Token): IOauth2Token {
        token['expires_at'] = DateTime.now().toSeconds() + token['expires_in'];
        token['refresh_token_expires_at'] =
            DateTime.now().toSeconds() + token['refresh_token_expires_in'];
        return token;
    }

    // User Settings
    /**
     * Get basic user information
     * @returns {Promise<*>}
     */
    async getUserSettings(): Promise<any> {
        return this.client.get(this.url.USER_SETTINGS);
    }
}

import appRoot from 'app-root-path';
import FormData from 'form-data';
import qs from 'qs';
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
import { HttpClient } from '../common/HttpClient';
import { UrlClass } from './UrlClass';
import { GCUserHash, GarminDomain } from './types';

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
        const step1Url =
            this.url.GARMIN_SSO_EMBED + '?' + qs.stringify(step1Params);
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
                Origin: 'https://sso.garmin.com',
                Referer: this.url.GARMIN_SSO,
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
        const step4Params = {
            ticket,
            'login-url': this.url.GARMIN_SSO_EMBED,
            'accepts-mfa-tokens': true
        };
        const step4Url = `${this.url.OAUTH_URL}/preauthorized?${qs.stringify(
            step4Params
        )}`;

        const step4Oauth = OAuth({
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
            url: step4Url,
            method: 'GET'
        };
        const step4Headers = step4Oauth.toHeader(
            step4Oauth.authorize(step4RequestData)
        );
        console.log('login - step4Headers:', step4Headers);

        const step4Response = await this.client.get(step4Url, {
            headers: {
                ...step4Headers,
                'User-Agent': USER_AGENT_CONNECTMOBILE
            }
        });
        console.log('login - step4Response:', step4Response);
        const step4Token = qs.parse(step4Response);
        console.log('login - step4Token:', step4Token);

        // Step 5: Oauth2
        const step5Token = {
            key: step4Token.oauth_token,
            secret: step4Token.oauth_token_secret
        };

        const step5BaseUrl = `${this.url.OAUTH_URL}/exchange/user/2.0`;
        const step5RequestData = {
            url: step5BaseUrl,
            method: 'POST',
            data: null
        };

        const step5AuthData = step4Oauth.authorize(
            step5RequestData,
            step5Token
        );
        console.log('login - step5AuthData:', step5AuthData);
        const step5Url = step5BaseUrl + '?' + qs.stringify(step5AuthData);
        const step5Response = await this.client.post(step5Url, null, {
            headers: {
                'User-Agent': USER_AGENT_CONNECTMOBILE,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('login - step5Response:', step5Response);

        return this;
    }
}

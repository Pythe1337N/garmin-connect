import appRoot from 'app-root-path';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { HttpClient } from '../common/HttpClient';
import { checkIsDirectory, createDirectory, writeToFile } from '../utils';
import { UrlClass } from './UrlClass';
import { GCUserHash, GarminDomain, IOauth1Token, IOauth2Token } from './types';

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
        this.credentials = credentials;
        this.url = new UrlClass(domain);
        this.client = new HttpClient(this.url);
        this._userHash = undefined;
        this.listeners = {};
    }

    async login(username?: string, password?: string): Promise<GarminConnect> {
        if (username && password) {
            this.credentials.username = username;
            this.credentials.password = password;
        }
        await this.client.login(
            this.credentials.username,
            this.credentials.password
        );
        return this;
    }
    exportTokenToFile(dirPath: string): void {
        if (!checkIsDirectory(dirPath)) {
            createDirectory(dirPath);
        }
        // save oauth1 to json
        if (this.client.oauth1Token) {
            writeToFile(
                path.join(dirPath, 'oauth1_token.json'),
                JSON.stringify(this.client.oauth1Token)
            );
        }
        if (this.client.oauth2Token) {
            writeToFile(
                path.join(dirPath, 'oauth2_token.json'),
                JSON.stringify(this.client.oauth2Token)
            );
        }
    }
    loadTokenByFile(dirPath: string): void {
        if (!checkIsDirectory(dirPath)) {
            throw new Error('loadTokenByFile: Directory not found: ' + dirPath);
        }
        let oauth1Data = fs.readFileSync(
            path.join(dirPath, 'oauth1_token.json')
        ) as unknown as string;
        const oauth1 = JSON.parse(oauth1Data);
        this.client.oauth1Token = oauth1;

        let oauth2Data = fs.readFileSync(
            path.join(dirPath, 'oauth2_token.json')
        ) as unknown as string;
        const oauth2 = JSON.parse(oauth2Data);
        this.client.oauth2Token = oauth2;
    }
    // from db or localstorage etc
    loadToken(oauth1: IOauth1Token, oauth2: IOauth2Token): void {
        this.client.oauth1Token = oauth1;
        this.client.oauth2Token = oauth2;
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

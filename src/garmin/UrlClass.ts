import { GarminDomain } from './types';

export class UrlClass {
    private domain: GarminDomain;
    GC_MODERN: string;
    GARMIN_SSO_ORIGIN: string;
    GC_API: string;
    constructor(domain: GarminDomain = 'garmin.com') {
        this.domain = domain;
        this.GC_MODERN = `https://connect.${this.domain}/modern`;
        this.GARMIN_SSO_ORIGIN = `https://sso.${this.domain}`;
        this.GC_API = `https://connectapi.${this.domain}`;
    }
    get GARMIN_SSO() {
        return `${this.GARMIN_SSO_ORIGIN}/sso`;
    }
    get GARMIN_SSO_EMBED() {
        return `${this.GARMIN_SSO_ORIGIN}/sso/embed`;
    }
    get BASE_URL() {
        return `${this.GC_MODERN}/proxy`;
    }
    get SIGNIN_URL() {
        return `${this.GARMIN_SSO}/signin`;
    }
    get LOGIN_URL() {
        return `${this.GARMIN_SSO}/login`;
    }
    get OAUTH_URL() {
        return `${this.GC_API}/oauth-service/oauth`;
    }
}

export enum ExportFileType {
    tcx = 'tcx',
    gpx = 'gpx',
    kml = 'kml',
    zip = 'zip'
}

export enum UploadFileType {
    tcx = 'tcx',
    gpx = 'gpx',
    fit = 'fit'
}

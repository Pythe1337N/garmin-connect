import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    RawAxiosRequestHeaders
} from 'axios';
import { IOauth1Token, IOauth2Token } from '../garmin/types';
import _ from 'lodash';

export class HttpClient {
    client: AxiosInstance;
    oauth1Token: IOauth1Token | undefined;
    oauth2Token: IOauth2Token | undefined;

    constructor() {
        this.client = axios.create();
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (axios.isAxiosError(error)) {
                    if (error?.response) this.handleError(error?.response);
                }
                throw error;
            }
        );
    }

    setCommonHeader(headers: RawAxiosRequestHeaders): void {
        _.each(headers, (headerValue, key) => {
            this.client.defaults.headers.common[key] = headerValue;
        });
    }

    handleError(response: AxiosResponse): void {
        this.handleHttpError(response);
    }

    handleHttpError(response: AxiosResponse): void {
        const { status, statusText, data } = response;
        const msg = `ERROR: (${status}), ${statusText}, ${JSON.stringify(
            data
        )}`;
        console.error(msg);
        throw new Error(msg);
    }

    async get(url: string, config?: AxiosRequestConfig<any>) {
        const response = await this.client.get(url, config);
        return response?.data;
    }

    async post(url: string, data: any, config?: AxiosRequestConfig<any>) {
        const response = await this.client.post(url, data, config);
        return response?.data;
    }
}

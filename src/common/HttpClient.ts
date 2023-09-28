import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse
} from 'axios';
import { IOauth1Token, IOauth2Token } from '../garmin/types';

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

    setHeader(token: string, backendApi: string): void {
        this.client.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${token}`;
        this.client.defaults.headers.common['Di-Backend'] = backendApi;
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

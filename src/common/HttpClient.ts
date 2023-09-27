import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpClient {
    client: AxiosInstance;

    constructor() {
        this.client = axios.create();
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

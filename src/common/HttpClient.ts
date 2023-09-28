import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse
} from 'axios';

export class HttpClient {
    client: AxiosInstance;

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

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

class AxiosService {
    private instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: 'http://localhost:5001',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60000
        });

        this.handleResponse = this.handleResponse.bind(this);
        this.handleError = this.handleError.bind(this);

        this.initializeInterceptors();
    }

    private initializeInterceptors() {
        this.instance.interceptors.response.use(
            this.handleResponse,
            this.handleError,
        );
    }

    private handleResponse(response: AxiosResponse) {
        return response;
    }

    protected handleError(error: AxiosError | Error) {
        return error;
    }

    public get<T>(url: string, params: any = undefined, addHeaders: any = {}): Promise<T> {
        const headers = {
            ...this.instance.defaults.headers,
            ...addHeaders
        };

        return this.instance.get<T, T>(url, { params, headers });
    }

    public post<T>(url: string, data: any, addHeaders: any = {}): Promise<T> {
        return this.instance.post<T, T>(url, data, {
            headers: Object.assign({}, this.instance.defaults.headers, addHeaders)
        });
    }
}

export const axiosService = new AxiosService();

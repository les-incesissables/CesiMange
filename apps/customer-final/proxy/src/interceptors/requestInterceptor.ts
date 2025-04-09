// src/interceptors/requestInterceptor.ts
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export function applyRequestInterceptor(client: AxiosInstance): void {
    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const xsrfToken = localStorage.getItem('xsrfToken');
            if (xsrfToken) {
                config.headers['x-xsrf-token'] = xsrfToken;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );
}

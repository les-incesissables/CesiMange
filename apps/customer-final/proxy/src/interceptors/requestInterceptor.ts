// src/interceptors/requestInterceptor.ts
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const APPLICATION_NAME = 'CesiMange-client';

export function applyRequestInterceptor(client: AxiosInstance): void {
    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Injection du nom de l'application
            config.headers['x-application-name'] = APPLICATION_NAME;

            // Récupère le token XSRF depuis le localStorage
            const xsrfTokenRaw = localStorage.getItem('xsrfToken');
            if (xsrfTokenRaw) {
                // Supprime les éventuels guillemets supplémentaires
                const xsrfToken = xsrfTokenRaw.replace(/^"+|"+$/g, '');
                config.headers['x-xsrf-token'] = xsrfToken;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );
}

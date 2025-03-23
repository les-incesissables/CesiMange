// src/interceptors/requestInterceptor.ts

import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

export function applyRequestInterceptor(client: AxiosInstance): void {
    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
            config.headers = config.headers ?? {};

            // Récupérer le token depuis localStorage (attention si utilisé côté Node)
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            // Ajouter d'autres transformations si nécessaire
            return config;
        },
        (error: AxiosError): Promise<never> => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );
}

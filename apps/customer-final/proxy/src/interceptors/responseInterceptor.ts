// src/interceptors/responseInterceptor.ts

import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export function applyResponseInterceptor(client: AxiosInstance): void {
    client.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => {
            // Transformation de la réponse si besoin
            console.log('respooooooonse test : ', response);
            return response;
        },
        (error: AxiosError): Promise<never> => {
            if (error.response) {
                console.error('Response error:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Axios setup error:', error.message);
            }
            return Promise.reject(error);
        },
    );
}

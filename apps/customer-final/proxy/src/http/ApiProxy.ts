// src/http/ApiClient.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { applyRequestInterceptor } from '../interceptors/requestInterceptor';
import { applyResponseInterceptor } from '../interceptors/responseInterceptor';

export class ApiProxy {
    private client: AxiosInstance;
    private cancelTokenSource?: CancelTokenSource;

    constructor() {
        // Création de l'instance Axios avec la configuration dynamique
        this.client = axios.create({
            baseURL: API_CONFIG.baseURL,
            timeout: API_CONFIG.timeout,
        });

        // Appliquer les intercepteurs externes
        applyRequestInterceptor(this.client);
        applyResponseInterceptor(this.client);
    }

    public async get<DTO = unknown>(endpoint: string, params: Record<string, unknown> = {}, pCritere?: any): Promise<AxiosResponse<DTO>> {
        const lConfig: AxiosRequestConfig = { params: params, data: pCritere };
        return this.client.get<DTO>(endpoint, lConfig);
    }

    public async post<T = unknown>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
        return this.client.post<T>(endpoint, data);
    }

    public async put<T = unknown>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
        return this.client.put<T>(endpoint, data);
    }

    public async patch<T = unknown>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
        return this.client.patch<T>(endpoint, data);
    }

    public async delete<T = unknown>(endpoint: string): Promise<AxiosResponse<T>> {
        return this.client.delete<T>(endpoint);
    }

    public createCancelToken(): CancelTokenSource {
        this.cancelTokenSource = axios.CancelToken.source();
        return this.cancelTokenSource;
    }

    public cancelRequest(message?: string): void {
        if (this.cancelTokenSource) {
            this.cancelTokenSource.cancel(message || 'Request cancelled by user.');
        }
    }
}

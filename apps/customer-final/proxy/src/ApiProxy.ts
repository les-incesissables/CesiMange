// apps/customer-app/proxy/src/ApiProxy.ts

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, CancelTokenSource } from 'axios';

// La configuration dynamique est importée depuis un fichier commun situé dans customer-app/config
import { API_CONFIG } from '../../config/config';

/**
 * ApiProxy is responsible for managing HTTP communications with the backend.
 * It creates an Axios instance with dynamic configuration and uses interceptors
 * for authentication, error handling, and request/response transformation.
 */
export class ApiProxy {
    private client: AxiosInstance;
    private cancelTokenSource?: CancelTokenSource;

    constructor() {
        // Création de l'instance Axios avec la configuration dynamique
        this.client = axios.create({
            baseURL: API_CONFIG.baseURL,
            timeout: API_CONFIG.timeout,
        });

        // Intercepteur de requête : ajout automatique du token d'authentification
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('authToken');

                config.headers = config.headers ?? {};

                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            (error: AxiosError) => {
                console.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        // Intercepteur de réponse : gestion centralisée des erreurs et transformation de données
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                // Optionnel : transformation de la réponse
                return response;
            },
            (error: AxiosError) => {
                if (error.response) {
                    // Erreur côté serveur
                    console.error('Response error:', error.response.data);
                    return Promise.reject(error);
                } else if (error.request) {
                    // Pas de réponse du serveur
                    console.error('No response received:', error.request);
                    return Promise.reject(error);
                } else {
                    // Erreur lors de l'initialisation de la requête
                    console.error('Axios setup error:', error.message);
                    return Promise.reject(error);
                }
            }
        );
    }

    /**
     * Performs a GET request.
     * @param endpoint - API endpoint (e.g., "/orders")
     * @param params - Optional query parameters.
     */
    public async get(endpoint: string, params = {}): Promise<AxiosResponse<any>> {
        return this.client.get(endpoint, { params });
    }

    /**
     * Performs a POST request.
     * @param endpoint - API endpoint (e.g., "/orders")
     * @param data - Request payload.
     */
    public async post(endpoint: string, data: any): Promise<AxiosResponse<any>> {
        return this.client.post(endpoint, data);
    }

    /**
     * Performs a PUT request.
     * @param endpoint - API endpoint (e.g., "/orders/123")
     * @param data - Request payload.
     */
    public async put(endpoint: string, data: any): Promise<AxiosResponse<any>> {
        return this.client.put(endpoint, data);
    }

    /**
     * Performs a PATCH request.
     * @param endpoint - API endpoint (e.g., "/orders/123")
     * @param data - Request payload.
     */
    public async patch(endpoint: string, data: any): Promise<AxiosResponse<any>> {
        return this.client.patch(endpoint, data);
    }

    /**
     * Performs a DELETE request.
     * @param endpoint - API endpoint (e.g., "/orders/123")
     */
    public async delete(endpoint: string): Promise<AxiosResponse<any>> {
        return this.client.delete(endpoint);
    }

    /**
     * Creates and returns a new cancel token source for request cancellation.
     */
    public createCancelToken(): CancelTokenSource {
        this.cancelTokenSource = axios.CancelToken.source();
        return this.cancelTokenSource;
    }

    /**
     * Cancels the ongoing request if a cancel token exists.
     * @param message - Optional cancellation message.
     */
    public cancelRequest(message?: string): void {
        if (this.cancelTokenSource) {
            this.cancelTokenSource.cancel(message || 'Request cancelled by user.');
        }
    }
}

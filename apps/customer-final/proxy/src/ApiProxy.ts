// apps/customer-app/proxy/src/ApiProxy.ts

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, CancelTokenSource } from 'axios';

// Importez la config dynamique depuis votre fichier commun
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
            (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
                // En mode strict, config.headers peut être undefined
                config.headers = config.headers ?? {};

                const token = localStorage.getItem('authToken');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                // Possibilité de transformation ou de log ici
                return config;
            },
            (error: AxiosError): Promise<never> => {
                console.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        // Intercepteur de réponse : gestion centralisée des erreurs et transformation de données
        this.client.interceptors.response.use(
            (response: AxiosResponse<unknown>): AxiosResponse<unknown> => {
                // Optionnel : transformation de la réponse
                return response;
            },
            (error: AxiosError): Promise<never> => {
                if (error.response) {
                    // Erreur côté serveur
                    console.error('Response error:', error.response.data);
                } else if (error.request) {
                    // Pas de réponse du serveur
                    console.error('No response received:', error.request);
                } else {
                    // Erreur lors de l'initialisation de la requête
                    console.error('Axios setup error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Performs a GET request.
     * @param endpoint - API endpoint (e.g., "/orders")
     * @param params - Optional query parameters.
     * @returns AxiosResponse<T> où T est le type de la donnée retournée
     */
    public async get<T = unknown>(endpoint: string, params: Record<string, unknown> = {}): Promise<AxiosResponse<T>> {
        return this.client.get<T>(endpoint, { params });
    }

    /**
     * Performs a POST request.
     * @param endpoint - API endpoint (e.g., "/orders")
     * @param data - Request payload.
     */
    public async post<T = unknown>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
        return this.client.post<T>(endpoint, data);
    }

    /**
     * Performs a PUT request.
     * @param endpoint - API endpoint (e.g., "/orders/123")
     * @param data - Request payload.
     */
    public async put<T = unknown>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
        return this.client.put<T>(endpoint, data);
    }

    /**
     * Performs a PATCH request.
     * @param endpoint - API endpoint (e.g., "/orders/123")
     * @param data - Request payload.
     */
    public async patch<T = unknown>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
        return this.client.patch<T>(endpoint, data);
    }

    /**
     * Performs a DELETE request.
     * @param endpoint - API endpoint (e.g., "/orders/123")
     */
    public async delete<T = unknown>(endpoint: string): Promise<AxiosResponse<T>> {
        return this.client.delete<T>(endpoint);
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

// src/middleware/LocalMiddleware.ts

import { RepositoryService } from '../api/RepositoryService';
import { NormalizedResponse } from '../interfaces/NormalizedResponse';
import { mapErrorCodeToMessage } from '../utils/errorMapper';

/**
 * LocalMiddleware handles local processing of messages between the platform and the application.
 * It abstracts API calls, normalizes responses, and provides additional local services (e.g., caching, offline handling).
 */
export class LocalMiddleware {
    public RestoRepo = RepositoryService.resto;
    public AuthRepo = RepositoryService.auth;
    public UserRepo = RepositoryService.user;

    /**
     * Processes incoming messages and normalizes them.
     * @param message - The raw message received.
     * @returns A normalized response.
     */
    public processIncomingMessage(message: any): NormalizedResponse {
        console.log('processIncomingMessage', message);
        if (!message) {
            return {
                status: 'failure',
                data: null,
                uiMessage: 'No response received.',
            };
        }
        if (message.error) {
            const code = message.error.code;
            return {
                status: 'failure',
                data: message.error,
                uiMessage: mapErrorCodeToMessage(code),
            };
        } else if (message.pending) {
            return {
                status: 'pending',
                data: message.pending,
                uiMessage: 'Your request is being processed...',
            };
        }
        return {
            status: 'success',
            data: message.data !== undefined ? message.data : message,
            uiMessage: 'Operation successful.',
        };
    }

    /**
     * Preprocesses outgoing messages by removing null values.
     * @param payload - The payload to be sent.
     * @returns The cleaned payload.
     */
    public preprocessOutgoingMessage(payload: any): any {
        const processedPayload = { ...payload };
        Object.keys(processedPayload).forEach((key) => {
            if (processedPayload[key] == null) {
                delete processedPayload[key];
            }
        });
        return processedPayload;
    }

    /**
     * Generic method to call an API function and process its response.
     * @param apiFunction - A function that returns a Promise.
     * @returns A normalized response.
     */
    public async callLocalApi(apiFunction: () => Promise<any>): Promise<NormalizedResponse> {
        try {
            const response = await apiFunction();
            console.log('API response:', response);
            return this.processIncomingMessage(response);
        } catch (error: any) {
            console.error('Local API call error:', error);
            const errorCode = error?.response?.status;
            return {
                status: 'failure',
                data: error,
                uiMessage: mapErrorCodeToMessage(errorCode),
            };
        }
    }
}

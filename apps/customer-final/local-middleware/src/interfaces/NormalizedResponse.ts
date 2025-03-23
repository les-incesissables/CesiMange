// src/interfaces/NormalizedResponse.ts

export interface NormalizedResponse {
    status: 'success' | 'failure' | 'pending';
    data: any;
    uiMessage: string;
}

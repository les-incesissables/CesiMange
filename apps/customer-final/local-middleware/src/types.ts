// apps/customer-final/local-middleware/src/types.ts

export interface NormalizedResponse {
    status: 'success' | 'failure' | 'pending';
    data: any;
    uiMessage: string;
}

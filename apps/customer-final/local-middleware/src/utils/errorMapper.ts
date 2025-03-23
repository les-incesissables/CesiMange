// src/utils/errorMapper.ts

export function mapErrorCodeToMessage(code?: number | string): string {
    switch (code) {
        case 400:
            return 'Bad request. Please check your input.';
        case 401:
            return 'Unauthorized. Please log in again.';
        case 403:
            return 'Forbidden. You do not have permission.';
        case 404:
            return 'Not found. The resource does not exist.';
        case 408:
            return 'Request timed out. Please try again.';
        case 500:
            return 'Internal server error. Please try later.';
        case 502:
            return 'Bad gateway. Please try later.';
        case 503:
            return 'Service unavailable. Please try again shortly.';
        case 504:
            return 'Gateway timeout. Please try again later.';
        default:
            return 'An unknown error occurred. Please try again.';
    }
}

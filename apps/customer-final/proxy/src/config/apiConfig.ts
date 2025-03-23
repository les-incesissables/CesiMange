// src/config/apiConfig.ts

const env = process.env.NODE_ENV || 'development';

export interface ApiConfig {
    baseURL: string;
    timeout: number;
    // Vous pouvez ajouter ici d'autres paramètres (ex: defaultHeaders, logLevel, etc.)
}

const configs: { [key: string]: ApiConfig } = {
    development: {
        baseURL: 'http://localhost:8080/',
        timeout: 5000,
    },
    staging: {
        baseURL: 'https://staging.api.cesimange.com/',
        timeout: 5000,
    },
    production: {
        baseURL: 'https://api.cesimange.com/',
        timeout: 5000,
    },
};

export const API_CONFIG: ApiConfig = configs[env];

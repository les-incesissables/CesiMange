// src/config/index.ts

export const CONFIG = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
    apiTimeout: Number(process.env.API_TIMEOUT) || 5000,
};

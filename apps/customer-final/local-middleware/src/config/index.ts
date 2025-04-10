// src/config/index.ts

export const CONFIG = {
    apiBaseUrl: 'http://localhost:8080',
    apiTimeout: Number(process.env.API_TIMEOUT) || 5000,
};

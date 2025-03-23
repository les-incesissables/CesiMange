// apps/customer-app/config/config.ts

const env = process.env.NODE_ENV || 'development';

interface ApiConfig {
    baseURL: string;
    timeout: number;
    // Vous pouvez ajouter ici d'autres paramètres (ex : headers par défaut, logLevel, etc.)
}

const config: { [key: string]: ApiConfig } = {
    development: {
        baseURL: 'http://localhost:8080/', // URL du serveur backend en dev
        timeout: 5000, // Timeout en millisecondes pour les requêtes HTTP
    },
    staging: {
        baseURL: 'https://staging.api.cesimange.com/', // URL de staging
        timeout: 5000,
    },
    production: {
        baseURL: 'https://api.cesimange.com/', // URL de production
        timeout: 5000,
    },
};

export const API_CONFIG: ApiConfig = config[env];

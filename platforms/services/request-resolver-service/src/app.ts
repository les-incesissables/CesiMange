require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
import express from 'express';
import { loadGatewayConfig } from './resolver.config';
import { setupProxies } from './proxySetup';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { securityMiddleware } from './middlewares/security';
import { requestLogger } from './middlewares/requestLogger';

import * as dotenv from 'dotenv';

const isDocker = process.env.DOCKER_ENV === 'true';

if (process.env.NODE_ENV === 'development' && isDocker === true) {
    dotenv.config({ path: '.env.development' });
} else if (process.env.NODE_ENV === 'development' && isDocker === false) {
    dotenv.config({ path: '.env.localhost' });
} else if (process.env.NODE_ENV === 'staging') {
    dotenv.config({ path: '.env.staging' });
} else if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
}

const config = loadGatewayConfig();
const app = express();
/* app should use bodyParser. For this example we'll use json. bodyParser allows you to
access the body of your request.
*/
app.use(bodyParser.json({ extended: true }));
// cm - Utilisation du cookieParser
app.use(cookieParser());
// Middlewares de sécurité et parsing
app.use(helmet());

app.use(
    cors({
        origin: ['http://localhost:3001'], // ou liste d'origines autorisées, ex: ['http://localhost:3000']
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-xsrf-token', 'x-application-name'],
        credentials: true,
    })
);

app.use(morgan('dev'));

// Middleware personnalisé pour afficher la provenance
app.use(requestLogger);

// Middlewares de sécurité (Helmet, CORS, etc.)
app.use(...securityMiddleware());

// Configuration des proxys
setupProxies(app, config);

app.listen(config.port, () => {
    console.log(`API Gateway listening on port ${config.port}`);
});

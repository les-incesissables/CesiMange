require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
import express from "express";
import { loadGatewayConfig } from "./resolver.config";
import { setupProxies } from "./proxySetup";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { securityMiddleware } from "./middlewares/security";
import { requestLogger } from "./middlewares/requestLogger";

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

app.use(morgan('dev'));

// Middleware personnalisé pour afficher la provenance
app.use(requestLogger);

// Middlewares de sécurité (Helmet, CORS, etc.)
app.use(...securityMiddleware());

// Configuration des proxys
setupProxies(app, config);

app.listen(config.port, () =>
{
    console.log(`API Gateway listening on port ${config.port}`);
});
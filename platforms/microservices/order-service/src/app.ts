//#region Imports
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import * as path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import * as dotenv from 'dotenv';
import { OrderController } from './controllers/orders/OrderController';
import { OrderMetier } from './metier/orders/OrderMetier';

const isDocker = process.env.DOCKER_ENV === 'true';

if (process.env.NODE_ENV === 'development' && isDocker === true)
{
    dotenv.config({ path: '.env.development' });
} else if (process.env.NODE_ENV === 'development' && isDocker === false)
{
    dotenv.config({ path: '.env.localhost' });
} else if (process.env.NODE_ENV === 'staging')
{
    dotenv.config({ path: '.env.staging' });
} else if (process.env.NODE_ENV === 'production')
{
    dotenv.config({ path: '.env.production' });
}


//#endregion

// Cr�ation de l'application Express
const app = express();

/* app should use bodyParser. For this example we'll use json. bodyParser allows you to
access the body of your request.
*/
app.use(bodyParser.json({ extended: true }));
// cm - Utilisation du cookieParser
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

/**
 * Logging HTTP standard avec morgan
 * Format 'dev' ou 'combined' selon vos besoins
 */
app.use(morgan('dev'));

const orderController = new OrderController(new OrderMetier());

app.use('/order', orderController.getRouter());

// Gestion des erreurs
app.use((req, res) =>
{
    res.status(404).json({
        code: 404,
        status: "Error",
        message: "Route not found.",
        data: null,
    });
});

// cm - We assign the port number 4004.
const port = 4004;

// We can see that the app is listening on which port.
app.listen(port, () =>
{
    console.log(`App is listening on port ${port}`);
});


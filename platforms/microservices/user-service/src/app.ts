//#region Imports
import 'reflect-metadata';
import express from 'express';
const bodyParser = require('body-parser');
require('dotenv').config();

import * as path from 'path';

//import { OrderController } from './src/controllers/order/OrderController';
//import { RestaurantController } from './src/controllers/restaurant/RestaurantController';
//import { RestaurantMetier } from './src/metier/restaurant/RestaurantMetier';
//import { OrderMetier } from './src/metier/order/OrderMetier';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import * as dotenv from 'dotenv';
import { UserProfileController } from './controllers/user_profiles/UserProfileController';
import { UserProfileMetier } from './metier/user_profiles/UserProfileMetier';

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

//#endregion

// Cr�ation de l'application Express
const app = express();

/* app should use bodyParser. For this example we'll use json. bodyParser allows you to
access the body of your request.
*/
app.use(bodyParser.json({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(
    cors({
        origin: ['http://localhost:3001'], // ou liste d'origines autorisées, ex: ['http://localhost:3000']
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-xsrf-token', 'x-application-name'],
        credentials: true,
    })
);

/**
 * Logging HTTP standard avec morgan
 * Format 'dev' ou 'combined' selon vos besoins
 */
app.use(morgan('dev'));

console.log('Connecting to', process.env.CONNECTION_STRING);
console.log('DB name is', process.env.MONGO_DB_NAME);
console.log('Docker use : ', isDocker);

const userProfileController = new UserProfileController(new UserProfileMetier());

app.use('/user-profiles', userProfileController.getRouter());

//app.use('/api/resto', restaurantController.getRouter());
//app.use('/api/order', orderMetier.getRouter());

// We assign the port number 8080.
const port = 4002;

// We can see that the app is listening on which port.
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

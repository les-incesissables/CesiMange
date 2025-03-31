//#region Imports
import "reflect-metadata"
import express from 'express';
const bodyParser = require('body-parser');
require('dotenv').config();

import * as path from 'path';

//import { OrderController } from './src/controllers/order/OrderController';
//import { RestaurantController } from './src/controllers/restaurant/RestaurantController';
//import { RestaurantMetier } from './src/metier/restaurant/RestaurantMetier';
//import { OrderMetier } from './src/metier/order/OrderMetier';
import { UserController } from './src/controllers/user/UserController';
import { UserMetier } from './src/metier/user/UserMetier';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

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
        origin: '*', // ou liste d'origines autorisées, ex: ['http://localhost:3000']
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);


/**
 * Logging HTTP standard avec morgan
 * Format 'dev' ou 'combined' selon vos besoins
 */
app.use(morgan('dev'));

const userController = new UserController(new UserMetier());
//const restaurantController = new RestaurantController(new RestaurantMetier());
//const orderMetier = new OrderController(new OrderMetier());
app.use('/api/users', userController.getRouter());

//app.use('/api/resto', restaurantController.getRouter());
//app.use('/api/order', orderMetier.getRouter());

// We assign the port number 8080.
const port = 4002;

// We can see that the app is listening on which port.
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

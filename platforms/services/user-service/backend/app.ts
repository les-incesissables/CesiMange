    //#region Imports
// We import the fs module so that we can have access to the file system.
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

import * as path from 'path';

import { OrderController } from './controllers/order/OrderController';
import { RestaurantController } from './controllers/restaurant/RestaurantController';
import { UserController } from './controllers/user/UserController';

import { RestaurantMetier } from './metier/restaurant/RestaurantMetier';
import { UserMetier } from './metier/user/UserMetier';
import { OrderMetier } from './metier/order/OrderMetier';

//#endregion

// Création de l'application Express
const app = express();

/* app should use bodyParser. For this example we'll use json. bodyParser allows you to
access the body of your request.
*/
app.use(bodyParser.json({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const userController = new UserController(new UserMetier());
const restaurantController = new RestaurantController(new RestaurantMetier());
const orderMetier = new OrderController(new OrderMetier());

app.use('/api/users', userController.getRouter());
app.use('/api/resto', restaurantController.getRouter());
app.use('/api/order', orderMetier.getRouter());

// We assign the port number 8080.
const port = 8080;

// We can see that the app is listening on which port.
app.listen(port, () =>
{
    console.log(`App is listening on port ${port}`);
});
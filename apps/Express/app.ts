// We import the fs module so that we can have access to the file system.
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

import * as path from 'path';

import routes from './routes/index';
import users from './routes/user';
import { OrderController } from './controllers/order/OrderController';
import { RestaurantController } from './controllers/restaurant/RestaurantController';
import { UserController } from './controllers/user/UserController';
import { RestaurantMetier } from './metier/restaurant/RestaurantMetier';
import { UserMetier } from './metier/user/UserMetier';
import { OrderMetier } from './metier/order/OrderMetier';

// Création de l'application Express
const app = express();

/* app should use bodyParser. For this example we'll use json. bodyParser allows you to
access the body of your request.
*/
app.use(bodyParser.json({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes existantes
app.use('/', routes);
app.use('/users', users);

const userController = new UserController(new UserMetier());
const restaurantController = new RestaurantController(new RestaurantMetier());
const orderMetier = new OrderController(new OrderMetier());



// Ajout des routes du UserController
app.use('/api/users', userController.getRouter()); // Utilisez un préfixe comme '/api/users' pour éviter les conflits
app.use('/api/resto', restaurantController.getRouter()); // Utilisez un préfixe comme '/api/users' pour éviter les conflits
app.use('/api/order', orderMetier.getRouter()); // Utilisez un préfixe comme '/api/users' pour éviter les conflits


// We assign the port number 8080.
const port = 8080;

// We can see that the app is listening on which port.
app.listen(port, () =>
{
    console.log(`App is listening on port ${port}`);
});
// We import the fs module so that we can have access to the file system.
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

import * as path from 'path';

import routes from './routes/index';
import users from './routes/user';
import { UserController } from './controllers/UserController';
import { UserMetier } from './metier/base/UserMetier';

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

// Ajout des routes du UserController
app.use('/api/users', userController.getRouter()); // Utilisez un préfixe comme '/api/users' pour éviter les conflits

// We assign the port number 8080.
const port = 8080;

// We can see that the app is listening on which port.
app.listen(port, () =>
{
    console.log(`App is listening on port ${port}`);
});
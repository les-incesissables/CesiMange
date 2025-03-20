//#region Imports
// We import the fs module so that we can have access to the file system.
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

import * as path from 'path';

//#endregion

// Création de l'application Express
const app = express();

/* app should use bodyParser. For this example we'll use json. bodyParser allows you to
access the body of your request.
*/
app.use(bodyParser.json({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// We assign the port number 8080.
const port = 8080;

// We can see that the app is listening on which port.
app.listen(port, () =>
{
    console.log(`App is listening on port ${port}`);
});
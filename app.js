// Enviroment variable
require('dotenv').config();
// 3rd-party imports
const express = require('express');
const bodyParser = require('body-parser');
// Local imports
const feedRoutes = require('./routes/feed');
// Global variables
const port = process.env.SERVER_PORT;
const app = express();
// 3rd-party middleware
app.use(bodyParser.json()); // - since we want to expect json data on both req and res, we parse it thru json method
// Using routes
app.use('/feed', feedRoutes);
// Listening to port
app.listen(port);
console.log(`Server is running on port - ${port}`);

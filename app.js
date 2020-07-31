// Enviroment variable
require('dotenv').config();
// 3rd-party imports
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
// Local imports
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
// Global variables
const port = process.env.SERVER_PORT;
const app = express();
// Multer configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Math.random() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// 3rd-party middleware
app.use(multer({ storage: fileStorage }, fileFilter).single('image'));
app.use(bodyParser.json()); // - since we want to expect json data on both req and res, we parse it thru json method
app.use('/images', express.static(path.join(__dirname, 'images')));
// Handling CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Using routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
// Global error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    data,
  });
});
// Establishing connection with database and running server
mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    // app listen returns a nodejs server
    const nodeServer = app.listen(port);
    // we pass server to function exposed by socket io package
    // it will establish websockets on http
    const io = require('./socket').init(nodeServer);
    // and now we create event listeners like this
    // this function is executed on every new client that connects to server
    io.on('connection', (socket) => {
      console.log('Client connected');
    });

    console.log(`Server is running on port - ${port}`);
  })
  .catch((err) => console.log(err));

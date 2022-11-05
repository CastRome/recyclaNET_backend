require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoute = require('./api/Users/Users.route');
const favsRoute = require('./api/Favs/Favs.route');
const listsRoute = require('./api/Lists/Lists.route');
const requestRoute = require('./api/Request/Request.route');
const app = express();

app.use(express.json());
app.use(cors());

app.use(morgan('tiny'));

var corsOptions = {
  origin: 'https://recyclanet.herokuapp.com',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://recyclanet.herokuapp.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
app.use(allowCrossDomain);
//app.use(corsOptions);

app.use('/auth/local', userRoute);
app.use('/api/favs', favsRoute);
app.use('/api/lists', listsRoute);
app.use('/api/requests', requestRoute);

module.exports = app;

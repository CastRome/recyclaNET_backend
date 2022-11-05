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
  origin: 'https://recyclanet.herokuapp.com/',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use('/auth/local', corsOptions, userRoute);
app.use('/api/favs', corsOptions, favsRoute);
app.use('/api/lists', corsOptions, listsRoute);
app.use('/api/requests', corsOptions, requestRoute);

module.exports = app;

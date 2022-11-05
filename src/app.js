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

app.use('/auth/local', userRoute);
app.use('/api/favs', favsRoute);
app.use('/api/lists', listsRoute);
app.use('/api/requests', requestRoute);

module.exports = app;

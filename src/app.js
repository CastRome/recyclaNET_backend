require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoute = require('./api/Users/Users.route');
const requestRoute = require('./api/Request/Request.route');
const app = express();
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://recyclanet.herokuapp.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
app.use(express.json());
// app.use(
//   cors({
//     //origin: 'https://recyclanet.herokuapp.com',
//     origin: '190.84.116.210',
//     credentials: true,
//   }),
// );
app.use(cors());
//app.use(allowCrossDomain);

app.use(morgan('tiny'));

//app.use(corsOptions);

app.use('/auth/local', userRoute);
app.use('/api/requests', requestRoute);

module.exports = app;

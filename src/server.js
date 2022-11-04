const app = require('./app');
const { connect } = require('./db');

const port = process.env.PORT;
connect();

app.listen(port, () => {
  console.log('Server Running Ok');
});

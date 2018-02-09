const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./controllers');
const bodyParser = require('body-parser');
const cors = require('cors');
mongoose.Promise = require('bluebird');

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

//  Connect all our routes to our application
app.use('/', routes);

// Connects our server to mongoDB
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds249605.mlab.com:49605/water_festival`, {
	useMongoClient: true,
});

app.listen(9090, function () {
  // eslint-disable-next-line no-console
  console.log('Backend server is listening on port 9090!')
});

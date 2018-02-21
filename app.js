const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./controllers');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
mongoose.Promise = require('bluebird');
const User = require('./models/User');

require('dotenv').config();

const PORT = process.env.PORT || 9090;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'some-secret',
  saveUninitialized: false,
  resave: true
}));

// Enable CORS
app.use(cors());


app.use(passport.initialize());

// Enable flash - stores message to be used in redirects
app.use(flash());

//  Connect all our routes to our application
app.use('/', routes);

// Connects our server to mongoDB
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds225028.mlab.com:25028/waterfestivaldb`, {
	useMongoClient: true,
});

// Passport.js for user authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (!username || !password) return done(null, false, { message: 'Required fields not filled out.' });
    User.findOne({ username }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      User.authenticate(username, password, (err, user) => {
    		if (err) return done(err);
    		else if (!user) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
    	});
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.listen(PORT, function () {
  // eslint-disable-next-line no-console
  console.log('Backend server is listening on port 9090!')
});

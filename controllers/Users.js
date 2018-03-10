const userRouter = require('express').Router();
const mongodb = require('mongodb');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

userRouter.get('/list', function(req, res) {
  User.find(function(err, users) {
    if (err) return res.status(500).json(err);
    const mappedUsers = users.map(q => q.toJSONFor());
    res.json(mappedUsers);
  });
});

userRouter.get('/id/:id', function(req, res) {
  const id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) return res.status(500).json(err);
    if (!user) return res.json("User not found!");
    res.json(user);
  });
});

userRouter.delete('/delete', function(req, res) {
  const ids = req.body.userIDs.map(function(id) {
    return new mongodb.ObjectID(id);
  });

  User.deleteMany({
    _id: {
      $in: ids
    }
  }, function(err) {
    if (err) return res.status(500).send(err);
  });
  res.send({
    "message": "Deleted user/users!"
  });
});

userRouter.post('/insert', function(req, res) {
  const {
    name,
    username,
    school,
    day,
    phoneNumber,
    password,
    activities,
    alertsViewed,
  } = req.body;

  if (!username || !name || !password) return res.status(500).send(`Required fields not filled out.`);

  bcrypt.hash(password, 10).then(hash => {
    const user = new User({
      name,
      username,
      school,
      day,
      phoneNumber,
      password: hash,
      activities
    });
    user.save(function(err) {
      if (err) return res.status(500).json(err);
      res.json({
        message: 'User created!',
        user
      });
    });
  }).catch(err => res.status(500).send(err));
});

// Updates user's list of activities, given an user id and an array of
//  activity ids
userRouter.put('/edit', function(req, res) {
  const userToEdit = req.body;

  User.findById(userToEdit.id, function(err, user) {
    if (err) return res.send(err);
    else if (!user) return res.send('User ID not found!');

    if (userToEdit.hasOwnProperty('password')) {
      bcrypt.hash(userToEdit.password, 10).then(hash => {
        userToEdit.password = hash;
        user.set(userToEdit);
        user.save(function(err, updatedUser) {
          if (err) return res.send(err.message);

          res.json({
            message: 'User updated!',
            user: updatedUser
          });
        });
      }).catch(err => res.status(500).send(err));
    } else {
      user.set(userToEdit);
      user.save(function(err, updatedUser) {
        if (err) return res.send(err.message);

        res.json({
          message: 'User updated!',
          user: updatedUser
        });
      });
    }
  });
});

// Authenticate user
userRouter.post('/authenticate',
  passport.authenticate('local', {
    failureRedirect: '/users/auth_fail',
    failureFlash: true
  }),
  function(req, res) {
    const { user } = req;
    res.json({ success: true, user });
  }
);

// Authentication failed
userRouter.get('/auth_fail', function(req, res) {
  const { error } = req.flash();
  res.json({ success: false, error: error[0] });
});

module.exports = userRouter;

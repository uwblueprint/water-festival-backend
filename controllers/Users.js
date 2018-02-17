const userRouter = require('express').Router();
const mongodb = require('mongodb');
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
  const user = new User();
  user.name = req.body.name;
  user.school = req.body.school;
  user.day = req.body.day;
  user.phoneNumber = req.body.phoneNumber;

  user.save(function(err) {
    if (err) return res.status(500).json(err);
    res.json({
      message: 'User created!',
      user
    });
  });
});

// Updates user's list of activities, given an user id and an array of
//  activity ids
userRouter.put('/activities/', function(req, res) {
	const { id, activities } = req.body;

	User.findById(id, function(err, user) {
		if (err) return res.send(err);
		else if (!user) return res.send('User ID not found!');

		user.set({ activities });
		user.save(function(err, updatedUser) {
			if (err) return res.send(err.message);

			res.json({
				message: 'User updated!',
				user: updatedUser
			});
		});
	});
});

module.exports = userRouter;

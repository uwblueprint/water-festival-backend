const activityRouter = require('express').Router();
const mongodb = require('mongodb');
const Activity = require('../models/Activity');

activityRouter.get('/list', function(req, res) {
  Activity.find(function(err, activities) {
    if (err) return res.status(400).json(err);
    const mappedActivities = activities.map(q => q.toJSONFor());
    res.json(mappedActivities);
  });
});

activityRouter.get('/id/:id', function(req, res) {
  const id = req.params.id;
  Activity.findById(id, function(err, activity) {
    if (err) return res.status(400).json(err);
    if (!activity) return res.json("Activity not found!");
    res.json(activity);
  });
});

activityRouter.delete('/delete', function(req, res) {
  var ids = req.body.activityIDs.map(function(id) {
    return new mongodb.ObjectID(id);
  });

  Activity.deleteMany({
    _id: {
      $in: ids
    }
  }, function(err) {
    if (err) return res.status(400).send(err);
  });
  res.send({
    "message": "Deleted activity/activities!"
  });
});

activityRouter.post('/insert', function(req, res) {
  var activity = new Activity();
  activity.title = req.body.title;
  activity.description = req.body.description;
  activity.station = req.body.station;
  activity.grade = req.body.grade;
  activity.imageURI = req.body.imageURI;
  activity.isNewActivity = req.body.isNewActivity;
  activity.isOpen = req.body.isOpen;
  activity.state = req.body.state;

  activity.save(function(err) {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Activity created!',
      activity
    });
  });
});

activityRouter.put('/edit', function(req, res) {
  const activityToEdit = req.body;

  Activity.findById(activityToEdit.id, function(err, activity) {
    if (err) return res.send(err.message);
    else if (!activity) return res.send('Activity ID not found!');

    activity.set(activityToEdit);
    activity.save(function(err, updatedActivity) {
      if (err) return res.status(400).json(err);
      res.json({
        message: 'Activity updated!',
        activity: updatedActivity
      });
    });
  });
});

module.exports = activityRouter;

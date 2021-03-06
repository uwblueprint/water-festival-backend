const AlertRouter = require('express').Router();
const mongodb = require('mongodb');
const Alert = require('../models/Alert');
const User = require('../models/User');
require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// get a list of alerts
AlertRouter.get('/list', function(req, res) {
  Alert.find(function(err, alerts) {
    if (err) return res.json(err);
    const mappedAlerts = alerts.map(q => q.toJSONFor());
    res.json(mappedAlerts);
  });
})

// get a specific alert
AlertRouter.get('/id/:id', function(req, res) {
  const id = req.params.id;
  Alert.findById(id, function(err, alert) {
    if (err) return res.status(400).json(err);
    if (!alert) return res.json("Alert not found!");
    res.json(alert);
  });
});

// delete a specific alert
AlertRouter.delete('/delete', function(req, res) {
  const ids = req.body.alertIDs.map(function(id) {
    return new mongodb.ObjectID(id);
  });

  Alert.deleteMany({
    _id: {
      $in: ids
    }
  }, function(err) {
    if (err) return res.status(400).send(err);
  });
  res.send({
    "message": "Deleted alert/alerts!"
  });
});

// post a new alert
AlertRouter.post('/insert', function(req, res) {
  const newAlert = new Alert();
  newAlert.name = req.body.name;
  newAlert.description = req.body.description;
  newAlert.isSmsSent = req.body.isSmsSent;
  newAlert.sentDate = req.body.sentDate;

  newAlert.save(function(err) {
    if (err) return res.status(400).json(err);
    else {
      return res.json({
        message: 'Alert created!',
        alert: newAlert
      });
    }
  });
});

// editing an existing alert
AlertRouter.put('/edit', function(req, res) {
  const alertToEdit = req.body;

  Alert.findById(alertToEdit.id, function(err, alert) {
    if (err) return res.status(400).send(err);
    else if (!alert) return res.send('Alert ID not found!');
    alert.set({
      name: alertToEdit.name,
      description: alertToEdit.description,
      isSmsSent: alertToEdit.isSmsSent,
      sentDate: alertToEdit.sentDate
    });
    alert.save(function(err, updatedAlert) {
      if (err) return err.message;

      res.json({
        message: 'Alert updated!',
        alert: updatedAlert
      });
    });
  });
});

AlertRouter.post('/text', function(req, res) {
  const alertToTextId = req.body.id;

  Alert.findById(alertToTextId, function(err, alert) {
    if (err) return res.status(400).send(err);

    const { name, description } = alert;
    const date = new Date().getDay();

    User.find({ 'day': date }, function(err, people) {
      if (err) return res.status(400).send(err);

      const phoneNumbers = people.map(people => people.phoneNumber);

      client.messages.create({
        to: phoneNumbers,
        from: process.env.TWILIO_NUMBER,
        body: `${name} - ${description}`,
      }).then(message => res.send(message.sid));
    });
  })
})

module.exports = AlertRouter;

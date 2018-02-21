const alertRouter = require('express').Router();
const mongodb = require('mongodb');
const Alert = require('../models/Alert');

// get a list of alerts
alertRouter.get('/list', function(req, res) {
	Alert.find(function(err, alerts) {
		if (err) res.json(err);
		const mappedAlerts = alerts.map(q => q.toJSONFor());
		res.json(mappedAlerts);
	});
})

// get a specific alert
alertRouter.get('/id/:id', function(req, res) {
  const id = req.params.id;
  Alert.findById(id, function(err, alert) {
    if (err) return res.status(500).json(err);
    if (!alert) return res.json("Alert not found!");
    res.json(alert);
  });
});

// delete a specific alert
alertRouter.delete('/delete', function(req, res) {
	const ids = req.body.alertIDs.map(function(id) {
		return new mongodb.ObjectID(id);
	});

  Alert.deleteMany({
    _id: {
      $in: ids
    }
  }, function(err) {
    if (err) return res.status(500).send(err);
  });
  res.send({
    "message": "Deleted alert/alerts!"
  });
});

// post a new alert
alertRouter.post('/insert', function(req, res) {
	const newAlert = new Alert();
	newAlert.id = req.body.id;
	newAlert.name = req.body.bame;
	newAlert.description = req.body.description;
	newAlert.timestamp = req.body.timestamp;
	newAlert.isSmsSent = req.body.isSmsSent;

	newAlert.save(function(err) {
		if (err) return res.status(500).json(err);
		else {
			return res.json({
				message: 'Alert created!',
				Alert,
			});
		}
	});
});

// editing an existing alert
alertRouter.put('/edit', function(req, res) {
	const alertToEdit = req.body;

	Alert.findById(alertToEdit.id, function(err, alert) {
		if (err) return res.status(500).send(err);
		else if (!alert) return res.send('Alert ID not found!');
		alert.set({
			id: alertToEdit.id,
			name: alertToEdit.name,
			description: alertToEdit.description,
			timestamp: alertToEdit.timestamp,
			isSmsSent: alertToEdit.isSmsSent
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

module.exports = alertRouter;

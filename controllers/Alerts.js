const AlertRouter = require('express').Router();
const mongodb = require('mongodb');
const Alert = require('../models/Alert');

// get a list of alerts
AlertRouter.get('/list', function(req, res) {
	Alert.find(function(err, CurrAlert) {
		if (err) {
			res.json(err);
		}
		const CurrAlert = CurrAlert.map(q => q.toJSONFor());
		res.json(CurrAlert);
	});
})

// get a specific alert
AlertRouter.get('/id/:id', function(req, res) {
  const id = req.params.id;
  Alert.findById(id, function(err, CurrAlert) {
    if (err) {
      return res.status(500).json(err);
    }
    if (!CurrAlert) {
      return res.json("Alert not found!");
    }
    res.json(Alert);
  });
});

// delete a specific alert
AlertRouter.delete('/delete', function(req, res) {
	const ids = req.body.AlertIDs.map(function(id) {
		return new mongodb.ObjectID(id);
	});

	Alert.deleteMany({_id: {$in: ids}}, function(err) {
		if (err) {
			res.send(err);
		}
	});
	res.send('Deleted Alert/Alerts!');
})

// post a new alert
AlertRouter.post('/insert', function(req, res) {
	const NewAlert = New Alert();
	NewAlert.Id = req.body.Id;
  NewAlert.Name = req.body.Name;
  NewAlert.Description = req.body.Description;
  NewAlert.Timestamp = req.body.Timestamp;
  NewAlert.isSmsSent = req.body.isSmsSent;

	Alert.save(function(err) {
		if (err) {
			res.json(err);
		} else {
			res.json({
				message: 'Alert created!',
				Alert,
			});
		}
	});
});

// editing an existing alert
AlertRouter.put('/edit', function(req, res) {
	const AlertToEdit = req.body;

	Alert.findById(AlertToEdit.Id, function(err, Alert) {
		if (err) {
			res.send(err);
		} else if (!OldAlert) {
			res.send('Alert ID not found!');
		}
		Alert.set({
      Id: AlertToEdit.Id
			Name: AlertToEdit.Name,
			Description: AlertToEdit.Description,
      Timestamp: AlertToEdit.Timestamp,
      isSmsSent: AlertToEdit.isSmsSent
		});
		Alert.save(function(err, UpdatedAlert) {
			if (err) return err.message;

			res.json({
				message: 'Alert updated!',
				Alert: UpdatedAlert
			});
		});
	});
});

module.exports = AlertRouter;

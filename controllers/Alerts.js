const AlertRouter = require('express').Router();
const mongodb = require('mongodb');
const Alert = require('../models/Alert');

// get a list of alerts
AlertRouter.get('/list', function(req, res) {
	Alert.find(function(err, CurrAlert) {
		if (err) {
			res.json(err);
		}
		CurrAlert = CurrAlert.map(q => q.toJSONFor());
		res.json(currAlert);
	});
})

// get a specific alert
AlertRouter.get('/id/:id', function(req, res) {
  const id = req.params.id;
  Alert.findById(id, function(err, user) {
    if (err) {
      return res.status(500).json(err);
    }
    if (!user) {
      return res.json("User not found!");
    }
    res.json(user);
  });
});

// delete a specific alert
AlertRouter.delete('/delete', function(req, res) {
	var ids = req.body.currAlertIDs.map(function(id) {
		return new mongodb.ObjectID(id);
	});

	Alert.deleteMany({_id: {$in: ids}}, function(err) {
		if (err) {
			res.send(err);
		}
	});
	res.send('Deleted Alerts!');
})

// post a new alert
AlertRouter.post('/insert', function(req, res) {
	var NewAlert = New Alert();
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
AlertRouter.post('/edit', function(req, res) {
	var AlertToEdit = req.body;

	Alert.findById(AlertToEdit.Id, function(err, OldAlert) {
		if (err) {
			res.send(err);
		} else if (!OldAlert) {
			res.send('Alert ID not found!');
		}
		OldAlert.set({
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

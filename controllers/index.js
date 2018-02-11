const router = require('express').Router();

router.use('/faq', require('./Faq'));
router.use('/activities', require('./Activities'));
router.use('/users', require('./Users'));

router.get('/', function(req, res) {
	res.send("bacon!");
});

module.exports = router;

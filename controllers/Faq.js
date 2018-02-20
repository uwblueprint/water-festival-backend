const faqRouter = require('express').Router();
const mongodb = require('mongodb');
const Faq = require('../models/FAQ');

faqRouter.get('/list', function(req, res) {
	Faq.find(function(err, faqs) {
		if (err) res.status(500).json(err);
		const mappedFaqs = faqs.map(q => q.toJSONFor());
		return res.json(mappedFaqs);
	});
})

faqRouter.delete('/delete', function(req, res) {
	const ids = req.body.faqIDs.map(function(id) {
		return new mongodb.ObjectID(id);
	});

	Faq.deleteMany({_id: {$in: ids}}, function(err) {
		if (err) res.status(500).send(err);
	});
	res.send('Deleted questions!');
})

faqRouter.post('/insert', function(req, res) {
	const faq = new Faq();
	faq.question = req.body.question;
	faq.answer = req.body.answer;

	faq.save(function(err) {
		if (err) return res.status(500).json(err);
		 else {
			return res.json({
				message: 'Question created!',
				faq,
			});
		}
	});
});

faqRouter.put('/edit', function(req, res) {
	const questionToEdit = req.body;

	Faq.findById(questionToEdit.id, function(err, faq) {
		if (err) res.status(500).send(err);
		else if (!faq) res.send('Question ID not found!');

		faq.set({
			question: questionToEdit.question,
			answer: questionToEdit.answer
		});
		faq.save(function(err, updatedFaq) {
			if (err) return err.message;

			res.json({
				message: 'Question updated!',
				faq: updatedFaq
			});
		});
	});
});

module.exports = faqRouter;

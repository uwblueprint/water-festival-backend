var mongoose = require('mongoose');

var FAQSchema = new mongoose.Schema({
  question: String,
  answer: String
}, {timestamps: true});

// Requires population of author
FAQSchema.methods.toJSONFor = function() {
  return {
    id: this._id,
    createdAt: this.createdAt,
    question: this.question,
    answer: this.answer
  };
};

module.exports = mongoose.model('FAQ', FAQSchema);

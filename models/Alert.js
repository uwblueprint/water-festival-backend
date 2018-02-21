var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  timestamp: Date,
  isSmsSent: Boolean
}, {timestamps: true});

// Requires population of author
AlertSchema.methods.toJSONFor = function() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    timestamp: this.timestamp,
    isSmsSent: this.isSmsSent
  };
};

module.exports = mongoose.model('Alert', AlertSchema);

var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
  id: Number
  Name: String,
  Description: String,
  Timestamp: Date
  isSmsSent: Boolean
}, {timestamps: true});

// Requires population of author
AlertSchema.methods.toJSONFor = function() {
  return {
    id: this.id
    Name: this.Name,
    Description: this.Description,
    Timestamp: this.Timestamp,
    isSmsSent: this.isSmsSent
  };
};

module.exports = mongoose.model('Alert', AlertSchema);

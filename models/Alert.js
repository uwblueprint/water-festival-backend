var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
  Id: Number
  Name: String,
  Description: String,
  Timestamp: Date
  isSmsSent: Boolean
}, {timestamps: true});

// Requires population of author
AlertSchema.methods.toJSONFor = function() {
  return {
    Id: this.Id
    Name: this.Name,
    Description: this.Description,
    Timestamp: this.Timestamp,
    isSmsSent: this.isSmsSent
  };
};

module.exports = mongoose.model('Alert', AlertSchema);

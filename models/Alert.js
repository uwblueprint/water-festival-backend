var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
  name: String,
  description: String,
  isSmsSent: Boolean
}, {timestamps: true});

// Requires population of author
AlertSchema.methods.toJSONFor = function() {
  return {
    id: this._id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    name: this.name,
    description: this.description,
    isSmsSent: this.isSmsSent,
  };
};

module.exports = mongoose.model('Alert', AlertSchema);

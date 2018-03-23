var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
  userId: String,
  token: String,
}, {timestamps: true});

// Requires population of author
TokenSchema.methods.toJSONFor = function() {
  return {
    id: this._id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    userId: this.userId,
    token: this.token,
  };
};

module.exports = mongoose.model('Token', TokenSchema);

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  school: String,
  day: {
    type: Number,
    min : 1,
    max : 5
  },
  phoneNumber: String,
	activities: [String]
}, {timestamps: true});

// Requires population of author
UserSchema.methods.toJSONFor = function(){
  return {
    id: this._id,
    createdAt: this.createdAt,
    name: this.name,
    school: this.school,
    day: this.day,
    phoneNumber: this.phoneNumber,
		activities: this.activities
  };
};

module.exports = mongoose.model('User', UserSchema);

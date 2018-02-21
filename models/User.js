var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
	},
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  school: {
    type: String,
    trim: true
  },
  day: {
    type: Number,
    min : 1,
    max : 5
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  activities: [String]
}, {timestamps: true});

// Requires population of author
UserSchema.methods.toJSONFor = function(){
  return {
    id: this._id,
    createdAt: this.createdAt,
    name: this.name,
    username: this.username,
    school: this.school,
    day: this.day,
    phoneNumber: this.phoneNumber,
    password: this.password,
    activities: this.activities
  };
};

module.exports = mongoose.model('User', UserSchema);

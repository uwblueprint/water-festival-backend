const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) return next(err);
    user.password = hash;
    next();
  })
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username })
    .exec(function (err, user) {
      if (err) return callback(err)
      else if (!user) {
        const err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) return callback(null, user);
        else return callback();
      })
    });
}

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

const User = mongoose.model('User', UserSchema);
module.exports = User;

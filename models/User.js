const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  slackId: {
    type:String,
    require: true
  },
  slackUsername: {
    type:String,
    require: true
  },
  slackName: {
    type:String,
    require: true
  },
  firstTimeSlot: {
    type:String,
    require: true
  },
  secondTimeSlot: {
    type:String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema);
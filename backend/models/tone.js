var Mongoose = require('mongoose')
Mongoose.Promise = require('promise')

var ToneSchema = new Mongoose.Schema({
  tweetId: String,
  toneObj: Object,
  toneType: String, // tweet, day, week, speech, etc.
  toneScores: Object,
  toneText: String,
  toneTextDate: Date,
  addedDate: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Tone', ToneSchema)

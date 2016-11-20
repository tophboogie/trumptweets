var Mongoose = require('mongoose')

var TweetSchema = new Mongoose.Schema({
  text: String,
  date: Date,
  tone: Object,
  raw: Object,
  scrapeDate: { type: Date, default: Date.now }
});

var Tweet = Mongoose.model('Tweet', TweetSchema);

module.exports = Tweet

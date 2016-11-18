var Mongoose = require('mongoose')

var TweetSchema = new Mongoose.Schema({
  text: String,
  date: Date,
  tone: Object,
  scrapeDate: { type: Date, default: Date.now }
});

var Tweet = Mongoose.model('Tweet', TweetSchema);

module.exports = Tweet

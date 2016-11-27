var Mongoose = require('mongoose')

var TweetSchema = new Mongoose.Schema({
  tweetObj: Object,
  tweetText: String,
  tweetDate: Date,
  tweetId: String,
  scrapeDate: { type: Date, default: Date.now }
});

var Tweet = Mongoose.model('Tweet', TweetSchema);

module.exports = Tweet

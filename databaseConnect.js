var mongoose = require('mongoose');

var TrumpTweetsSchema = new mongoose.Schema({
  tweetText: String,
  tweetDate: Date,
  scrapeDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TrumpTweets', TrumpTweetsSchema);

var Mongoose = require('mongoose')
Mongoose.Promise = require('promise')

var TweetSchema = new Mongoose.Schema({
  tweetObj: Object,
  tweetText: String,
  tweetDate: Date,
  tweetId: String,
  scrapeDate: { type: Date, default: Date.now }
});

TweetSchema.statics.getID = function(query, cb) {
  return this.findOne({}, cb).sort(query)
}

module.exports = Mongoose.model('Tweet', TweetSchema)

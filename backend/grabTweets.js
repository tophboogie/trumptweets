var ScrapeTwitter = require('./scrapeTwitter.js')
var Tonify = require('./tonify.js')
var Tweet = require('./tweetModel.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')
console.log(mongoose.connection.readyState)

ScrapeTwitter()
  .then(Tonify)
  .then((data) => {
    new_tweets.forEach((element, i) => {
      element.tone = data[i]
    })
    return new_tweets
  })
  .done((data) => {
    data.forEach((element, i) => {
      var tweetToAdd = new Tweet({
        text: element.text,
        date: element.created_at,
        tone: element.tone
      })
      tweetToAdd.save((err) => {
        if (err) throw err
        console.log('Tweet Saved!')
      })
    })
  })

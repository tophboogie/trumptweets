var ScrapeTwitter = require('./scrapeTwitter.js')
var Tweet = require('./tweetModel.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')
console.log(mongoose.connection.readyState)

ScrapeTwitter().done((data) => {
  data.forEach((element, i) => {
    var tweetToAdd = new Tweet({
      text: element.text,
      date: element.created_at
    })
    tweetToAdd.save((err) => {
      if (err) throw err
      console.log('Tweet Saved!')
    })
  })
})

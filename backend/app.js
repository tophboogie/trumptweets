var Scrape = require('./scrape.js')
var Tweet = require('./tweetModel.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')

Scrape().done((data) => {
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

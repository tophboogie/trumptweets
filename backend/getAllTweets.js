var ScrapeTwitter = require('./scrapeTwitter.js')
var Tweet = require('./tweetModel.js')
var mongoose = require('mongoose')
var Promise = require('promise')
var bigInt = require("big-integer")

mongoose.connect('mongodb://localhost/tweets')
//console.log(mongoose.connection.readyState)

var today = new Date()

function getTweetID(query) {
  return new Promise((resolve, reject) => {
    Tweet.findOne().sort(query).exec((err, tweet) => {
      if (err)
        reject('There is a problem with the database')
      if (tweet)
        resolve(tweet.tweetId)
      else
        resolve(false)
    })
  })
}

Promise.all([getTweetID('tweetDate'), getTweetID('-tweetDate')])
  .then((data) => {
    var max_id = false,
        since_id = false
    if (data[0])
      max_id = bigInt(data[0]).add(-1).toString()
    if (data[1])
      since_id = data[1]
    console.log(max_id, since_id)
    ScrapeTwitter(max_id, false)
      .then((data) => {
        data.forEach((element, i) => {
          var tweetToAdd = new Tweet({
            tweetObj: element,
            tweetText: element.text,
            tweetDate: element.created_at,
            tweetId: element.id_str
          })
          tweetToAdd.save((err) => {
            if (err) throw err
            console.log('Tweet Saved!')
          })
        })
      })
  })

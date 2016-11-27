var GetTweets = require('./getTweets.js')
var Tweet = require('../models/tweet.js')
var Mongoose = require('mongoose')
var BigInt = require("big-integer")
var Promise = require('promise')

Mongoose.connect('mongodb://localhost/tweets')
Mongoose.Promise = require('promise')
//console.log(mongoose.connection.readyState)

function saveToDB(data) {
  var tweetsToAdd = []
  data.forEach((element, i) => {
    var tweetToAdd = new Tweet({
      tweetObj: element,
      tweetText: element.text,
      tweetDate: element.created_at,
      tweetId: element.id_str
    })
    tweetsToAdd.push(new Promise((resolve, reject) => {
      tweetToAdd.save((err) => {
        if (err)
          reject(err)
        else
          resolve()
      })
    }))
  })
  return Promise.all(tweetsToAdd)
}

var getOlderTweets = () => {
  Tweet.getID('tweetId', (err, data) => {
    if (err) return err
    var max_id = false
    if (data)
      max_id = BigInt(data.tweetId).add(-1).toString()
    GetTweets(max_id, false, 200).then((data) => {
      saveToDB(data).then((data) => {
        getOlderTweets()
      })
      .done(() => {
        console.log('Retrieved Tweets.')
        process.exit()
      })
    }, () => {
      getOlderTweets()
    })
  })
}

var getNewerTweets = () => {
  Tweet.getID('-tweetId', (err, data) => {
    if (err) return err
    var since_id = false
    if (data)
      since_id = data.tweetId
    GetTweets(false, since_id).then((data) => {
      saveToDB(data)
    })
  })
}

module.exports = {
  Older: getOlderTweets,
  Newer: getNewerTweets
}

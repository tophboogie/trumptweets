var GetTweets = require('./getTweets.js')
var Tweet = require('../models/tweet.js')
var Mongoose = require('mongoose')
var BigInt = require('big-integer')
var Promise = require('promise')

Mongoose.connect('mongodb://localhost/tweets')
Mongoose.Promise = require('promise')

// save all tweets return promise
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
  return new Promise((resolve, reject) => {

    recurse()
    function recurse() {

      // get oldest tweet ID
      Tweet.getID('tweetId', (err, data) => {
        if (err) return err
        var max_id = false

        // need library for subtraction (no 64bit in native JS)
        // subtract 1 as per Twitter docs
        if (data)
          max_id = BigInt(data.tweetId).add(-1).toString()

        // get tweets
        GetTweets(max_id, false).then((data) => {
          // if there are tweets, save
          if (data.length > 0) {
            saveToDB(data).done(() => {
              console.log('Saved', data.length, ' Tweets...')
              recurse()
            })
          }
          // if no tweets left, leave
          else {
            resolve()
          }
        // on connection error, try again
        }, () => {
          recurse()
        })
      })
    }
  })
}

var getNewerTweets = () => {
  return new Promise((resolve, reject) => {
    recurse()
    function recurse() {

      // get newest tweet ID
      Tweet.getID('-tweetId', (err, data) => {
        if (err) return err
        var since_id = false
        if (data)
          since_id = data.tweetId

        // get tweets
        GetTweets(false, since_id).then((data) => {

          // if there are tweets, save
          if (data.length > 0) {
            saveToDB(data).done(() => {
              console.log('Saved', data.length, ' Tweets...')
              resolve()
            })
          }
          // if no tweets left, leave
          else {
            resolve()
          }
        // if connection error, try again
        }, () => {
          recurse()
        })
      })
    }
  })
}

module.exports = {
  Older: getOlderTweets,
  Newer: getNewerTweets
}

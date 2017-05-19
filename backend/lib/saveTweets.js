// var GetTweets = require('./getTweets.js')
var Tweet = require('../models/tweet.js')
var Mongoose = require('mongoose')
var BigInt = require('big-integer')
var Promise = require('promise')

// Archive
var y2009 = require('../archive/2009')
var y2010 = require('../archive/2010')
var y2011 = require('../archive/2011')
var y2012 = require('../archive/2012')
var y2013 = require('../archive/2013')
var y2014 = require('../archive/2014')
var y2015 = require('../archive/2015')
var y2016 = require('../archive/2016')
var y2017 = require('../archive/2017')


var MONGODB_URI = process.env.MONGODB_URI
  ? process.env.MONGODB_URI + '/tweets'
  : 'mongodb://localhost/tweets'
Mongoose.connect(MONGODB_URI)
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

var getArchiveTweets = () => {
  return new Promise((resolve, reject) => {
    var get2009 = saveToDB(y2009)
    var get2010 = saveToDB(y2010)
    var get2011 = saveToDB(y2011)
    var get2012 = saveToDB(y2012)
    var get2013 = saveToDB(y2013)
    var get2014 = saveToDB(y2014)
    var get2015 = saveToDB(y2015)
    var get2016 = saveToDB(y2016)
    var get2017 = saveToDB(y2017)
    var promises = [get2009, get2010, get2011, get2012, get2013, get2014, get2015, get2016, get2017]
    Promise.all(promises).then(() => resolve())
                         .catch((err) => reject(err))
  })
}

module.exports = {
  Older: getOlderTweets,
  Newer: getNewerTweets,
  Archive: getArchiveTweets
}

var Schedule = require('node-schedule')
var Mongoose = require('mongoose')
var Promise = require('promise')
var moment = require('moment')

var getWordArray = require('./lib/getWordArray.js')

var WordMap = require('./models/wordMap.js')
var Tweet = require('./models/tweet.js')

Mongoose.connect('mongodb://localhost/tweets')
Mongoose.Promise = require('promise')

// var s = Schedule.scheduleJob({hour: 00, minute: 00}, function(){
  console.log('Getting Words...')
  var date = moment('2017-03-08')
  getWordMap(date).then((wordMap) => {
    saveToDB(getWordArray(wordMap), date, getTweetIds(wordMap)).done(() => {
      console.log('All Done!')
      process.exit()
    })
  })
// })

function getWordMap(date) {
  var startDate = date.clone().toDate()
  var endDate = date.clone().add(1, 'days').toDate()
  return new Promise((resolve, reject) => {
    Tweet.find({
      tweetDate: {
        $gt: startDate,
        $lt: endDate
      }})
      .sort('tweetDate')
      .select('_id tweetText')
      .exec(function (err, tweets) {
        if (err)
          reject(err)
        else {
          resolve(tweets)
        }
      })
  })
}

function getTweetIds(tweets) {
  var ids = []
  tweets.forEach((tweet) => {
    ids.push(tweet._id)
  })
  return ids
}

function saveToDB(wordMap, date, ids) {
  return new Promise((resolve, reject) => {
    var wordsToAdd = new WordMap({
      wordMapObj: wordMap,
      wordMapDate: date.clone().toDate(),
      _tweets: ids
    }).toObject()
    delete wordsToAdd._id
    WordMap.findOneAndUpdate({'wordMapDate': wordsToAdd.wordMapDate}, wordsToAdd, true, (err) => {
      if (err)
        reject(err)
      else
        resolve()
    }, true)
  })
}

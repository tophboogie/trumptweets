var Schedule = require('node-schedule')
var Mongoose = require('mongoose')
var Promise = require('promise')
var Moment = require('moment')

var getWordMap = require('./getWordMap.js')

var WordMap = require('../models/wordMap.js')
var Tweet = require('../models/tweet.js')

module.exports = (date) => {
  var dateStr = date.clone().toDate()
  console.log('Getting text for', dateStr)
  return new Promise((resolve, reject) => {
    getTweetTxt(date).then((tweets) => {
      saveToDB(getWordMap(tweets), date, getTweetIds(tweets)).done(() => {
        console.log('Saved words for', dateStr)
        resolve()
      })
    })
  })
}

function getTweetTxt(date) {
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
    WordMap.findOneAndUpdate({'wordMapDate': wordsToAdd.wordMapDate}, wordsToAdd, {upsert: true}, (err, res) => {
      if (err)
        reject(err)
      else
        resolve(res)
    }, true)
  })
}

var GetTone = require('./getTone.js')
var Tone = require('../models/tone.js')
var Tweet = require('../models/tweet.js')
var Mongoose = require('mongoose')
var Promise = require('promise')
var JsonQuery = require('json-query')

Mongoose.connect('mongodb://localhost/tweets')
Mongoose.Promise = require('promise')

function saveToDB(data) {
  console.log(data)
  return new Promise((resolve, reject) => {
    var toneToAdd = new Tone({
      tweetId: data.tweetId,
      toneObj: data.toneObj,
      toneType: data.toneType, // tweet, week, speech, etc.
      toneScores: data.toneScores,
      toneText: data.toneText,
      toneTextDate: data.toneTextDate,
    })
    toneToAdd.save((err) => {
      if (err)
        reject(err)
      else
        resolve()
    })
  })
}

var getToneByTweet = (id) => {
  return new Promise((resolve, reject) => {
    Tweet.findOne({tweetId: id}, (err, data) => {
      if (data && data.tweetText && data.tweetDate) {
        // tweet exists
        Tone.findOne({tweetId: id}, (err, tone) => {
          console.log('looking for this tone for tweet ' + id)
          if (err) {
            reject(err)
          } else if (tone) {
            //tone already exists
            console.log('already have this one')
            resolve()
          } else {
            GetTone(data.tweetText).then((toneObj) => {
              console.log('saving tweet ' + id)
              saveToDB({
                tweetId: id,
                toneObj: toneObj,
                toneType: 'tweet',
                toneScores: processTone(toneObj),
                toneText: data.tweetText,
                toneTextDate: data.tweetDate
              }).then((err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
            })
          }
        }) // tone findOne
      }
    }) // tweet findOne
  })
}

function processTone(data) {
  var emotion = JsonQuery('tone_categories[category_id=emotion_tone].tones', {data: data.document_tone}).value
  var language = JsonQuery('tone_categories[category_id=language_tone].tones', {data: data.document_tone}).value
  var social = JsonQuery('tone_categories[category_id=social_tone].tones', {data: data.document_tone}).value
  return {emotion, language, social}
}

module.exports = {
  byTweet: getToneByTweet
}

var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var Tweet = require('./models/tweet.js')
var Tone = require('./models/tone.js')
var WordMap = require('./models/wordMap.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')

var port = 3030

var router = express.Router()

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
app.use(cors())

router.route('/tweets').get(function(req, res) {
  var today = new Date()
  var monthAgo = new Date().setDate(today.getDate()-30)
  Tweet.find({
    tweetDate: {
      $gte: new Date(monthAgo)
    }})
    .sort('tweetDate')
    .select('tweetDate tweetText')
    .exec(function (err, tweets) {
      if (err)
        res.send(err)
      else {
        res.jsonp(tweets)
      }
    })
})

router.route('/tweets/:fromMo-:fromDay-:fromYr/to/:toMo-:toDay-:toYr').get(function(req, res) {
  var fromDate = new Date(req.params.fromYr, Number(req.params.fromMo) - 1, req.params.fromDay)
  var toDate = new Date(req.params.toYr, Number(req.params.toMo) - 1, Number(req.params.toDay) + 1)
  Tweet.find({
    tweetDate: {
      $gt: fromDate,
      $lt: toDate
    }})
    .sort('tweetDate')
    .select('tweetDate tweetText')
    .exec(function (err, tweets) {
      if (err)
        res.send(err)
      else {
        res.jsonp(tweets)
      }
    })
})

router.route('/words').get(function(req, res) {
  var today = new Date()
  var monthAgo = new Date().setDate(today.getDate()-30)
  WordMap.find({
    wordMapDate: {
      $gte: new Date(monthAgo)
    }})
    .sort('wordMapDate')
    .select('wordMapObj')
    .exec(function (err, wordMap) {
      if (err)
        res.send(err)
      else {
        res.jsonp(wordMap)
      }
    })
})

router.route('/words/:fromMo-:fromDay-:fromYr/to/:toMo-:toDay-:toYr').get(function(req, res) {
  var fromDate = new Date(req.params.fromYr, Number(req.params.fromMo) - 1, req.params.fromDay)
  var toDate = new Date(req.params.toYr, Number(req.params.toMo) - 1, Number(req.params.toDay) + 1)
  WordMap.find({
    wordMapDate: {
      $gt: fromDate,
      $lt: toDate
    }})
    .sort('wordMapDate')
    .select('wordMapObj wordMapDate')
    .exec(function (err, wordMap) {
      if (err)
        res.send(err)
      else {
        res.jsonp(wordMap)
      }
    })
})

router.route('/tone').get(function(req, res) {
  Tone.findOne({})
    .select('toneType toneScores toneText toneTextDate')
    .exec(function (err, tone) {
      if (err)
        res.send(err)
      else {
        res.jsonp(tone)
      }
    })
})

app.use('/', router)

app.listen(port)
console.log('API live on port: ' + port)

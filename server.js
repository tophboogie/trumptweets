var express = require('express')
var http = require('http')
var path = require('path')
var cors = require('cors')
var mongoose = require('mongoose')

var PORT = process.env.PORT || 3030
var MONGODB_URI = process.env.MONGODB_URI
  ? process.env.MONGODB_URI + '/tweets'
  : 'mongodb://localhost/tweets'

mongoose.connect(MONGODB_URI)

var Tweet = require('./backend/models/tweet.js')
var WordMap = require('./backend/models/wordMap.js')

var app = express()
app.use(cors())
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/build'))
}

var router = express.Router()

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

app.use('/api', router)

app.listen(PORT)

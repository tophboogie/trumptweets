var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var Tweet = require('./models/tweet.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')

var port = 3030

var router = express.Router()

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
// app.use(cors())

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

app.use('/', router)

app.listen(port)
console.log('API live on port: ' + port)

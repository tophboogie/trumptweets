var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var Tweet = require('./models/tweet.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')

var port = 3030

var router = express.Router()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

router.route('/').get(function(req, res) {
  Tweet.find({
    tweetDate: {
      $gte: new Date(2016, 5, 1),
      $lt: new Date(2016, 5, 10)
    }})
    .sort('tweetDate')
    .select('tweetDate tweetText')
    .exec(function (err, tweets) {
      if (err)
        res.send(err)
      else {
        res.json(tweets)
      }
    })
})

app.use('/api', router)

app.listen(port)
console.log('API live on port: ' + port)

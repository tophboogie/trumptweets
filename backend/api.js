var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var Tweet = require('./tweetModel.js')
var mongoose = require('mongoose')
var Tonify = require('./tonify.js')

mongoose.connect('mongodb://localhost/tweets')

var port = 3030

var router = express.Router()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

router.route('/').get(function(req, res) {
  Tweet.find((err, tweets) => {
    if (err)
      res.send(err)
    else
      res.json(tweets)
  })
})

router.route('/tonify').post(function(req, res) {
  Tweet.findById(req.body.id, (err, tweet) => {
    if (err)
      res.send(err)
    else if (tweet.tone)
      res.send(tweet)
    else
      Tonify([tweet]).done((data) => {
        tweet.tone = data[0]
        tweet.save((err) => {
          if (err)
            res.send(err)
          else
            res.send(tweet)
        })
      })
  })
})

app.use('/api', router)

app.listen(port)
console.log('API live on port: ' + port)

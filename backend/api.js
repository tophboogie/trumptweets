var express = require('express')
var app = express()
var Tweet = require('./tweetModel.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')

var port = process.env.PORT || 3000

var router = express.Router()

router.route('/').get(function(req, res) {
  Tweet.find((err, tweets) => {
    if (err)
      res.send(err)
    else
      res.json(tweets)
  })
})

app.use('/api', router)

app.listen(port)
console.log('Magic happens on port ' + port)

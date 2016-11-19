var express = require('express')
var app = express()
var cors = require('cors')
var Tweet = require('./tweetModel.js')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tweets')

var port = 3030

var router = express.Router()

app.use(cors());

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
console.log('API live on port: ' + port)

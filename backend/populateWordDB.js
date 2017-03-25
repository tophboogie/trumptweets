var Mongoose = require('mongoose')
var Promise = require('promise')
var Moment = require('moment')

var Tweet = require('./models/tweet.js')
var getRecentWords = require('./lib/getRecentWords.js')

Mongoose.connect('mongodb://localhost/tweets')
Mongoose.Promise = require('promise')

getFirstDate().done((firstDate) => {
  var tweetDate = Moment(firstDate)
  var today = Moment()
  recurse()
  function recurse() {
    if (tweetDate.isBefore(today, 'day')) {
      getRecentWords(tweetDate).done(() => {
        tweetDate.add(1, 'days')
        recurse()
      })
    }
    else {
      console.log('All Done!')
      process.exit()
    }
  }
})

function getFirstDate() {
  console.log('Getting Start Date...')
  return new Promise((resolve, reject) => {
    Tweet.findOne({}, {}, {sort: {'tweetDate': 1}}, (err, res) => {
      if(err)
        reject(err)
      else {
        resolve(res.tweetDate)
      }
    })
  })
}

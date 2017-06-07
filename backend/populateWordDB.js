var Mongoose = require('mongoose')
var Moment = require('moment')
var Promise = require('promise')

var Tweet = require('./models/tweet.js')
var getRecentWords = require('./lib/getRecentWords.js')

var MONGODB_URI = process.env.MONGODB_URI
 ? process.env.MONGODB_URI + '/tweets'
 : 'mongodb://localhost/tweets'

Mongoose.connect(MONGODB_URI)
Mongoose.Promise = require('promise')

getFirstDate().done((firstDate) => {
  var tweetDate = Moment(firstDate).startOf('day')
  var today = Moment().startOf('day')
  recurse()
  function recurse() {
    if (tweetDate.isSameOrBefore(today, 'day')) {
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

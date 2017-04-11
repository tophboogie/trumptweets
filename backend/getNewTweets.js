var Schedule = require('node-schedule')
var SaveTweets = require('./lib/saveTweets.js')
var getRecentWords = require('./lib/getRecentWords.js')
var moment = require('moment')

var s = Schedule.scheduleJob({minute: 00}, function(){
  console.log('Getting Tweets...')
  SaveTweets.Newer().done(() => {
    getRecentWords(moment()).done(() => {
      console.log('All Done!')
    })
  })
})

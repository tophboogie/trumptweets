var Schedule = require('node-schedule')
var SaveTweets = require('./lib/saveTweets.js')
var getRecentWords = require('./lib/getRecentWords.js')

var s = Schedule.scheduleJob({minute: 00}, function(){
  console.log('Getting Tweets...')
  SaveTweets.Newer().done(() => {
    getRecentWords(Moment()).done(() => {
      console.log('All Done!')
    })
  })
})

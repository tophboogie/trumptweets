var SaveTweets = require('./lib/saveTweets.js')
var Schedule = require('node-schedule')

var s = Schedule.scheduleJob({minute: 00}, function(){
  console.log('Getting Tweets...')
  SaveTweets.Newer().done(() => {
    console.log('All Done!')
  })
})

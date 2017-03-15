var GetWords = require('./lib/getWords.js')
var Schedule = require('node-schedule')

// var s = Schedule.scheduleJob({hour: 00, minute: 00}, function(){
  console.log('Getting Words...')
  GetWords(new Date).done(() => {
    console.log('All Done!')
  })
// })

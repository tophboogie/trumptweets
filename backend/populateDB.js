var SaveTweets = require('./lib/saveTweets.js')

console.log('Getting Tweets...')
SaveTweets.Older().done(() => {
  console.log('All Done!')
  process.exit()
})

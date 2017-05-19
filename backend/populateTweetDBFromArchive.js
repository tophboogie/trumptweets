var SaveTweets = require('./lib/saveTweets.js')

console.log('Getting Tweets...')
SaveTweets.Archive().done(() => {
  console.log('All Done!')
  process.exit()
})

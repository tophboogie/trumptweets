var SaveTone = require('./lib/saveTone.js')
var Tone = require('./models/tone.js')
var Tweet = require('./models/tweet.js')

Tweet.getID('-tweetId', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log('getting tweet ' + data.tweetId)
    SaveTone.byTweet(data.tweetId).done(() => {
      console.log('All Done!')
      process.exit()
    })
  }
})

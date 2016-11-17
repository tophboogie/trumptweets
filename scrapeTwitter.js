var Twit = require('twit')

var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth:        true,
  timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
})

T.get('statuses/user_timeline', {
    user_id: '25073877',
    trim_user: true,
    exclude_replies: true,
    include_rts: false
  }, (error, data, response) => {
    var newTweets = []
    data.forEach((element, i) => {
      newTweets[i] = {
        text: element.text,
        created_at: element.created_at
      }
    })
    console.log(newTweets)
  }
)

var user_id = '25073877' // Trump user id

var Twit = require('twit')
var Promise = require('promise')
var JsonQuery = require('json-query')

var Twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true
})

function TwitterSync() {
  return new Promise((resolve, reject) => {
    Twitter.get('statuses/user_timeline', {
        user_id: user_id,
        trim_user: true,
        exclude_replies: true,
        include_rts: false
      }, (err, data, resp) => {
        if (err)
          reject(err)
        else
          resolve(processTweets(data))
      }
    )
  })
}

function processTweets(data) {
  new_tweets = []
  data.forEach((element, i) => {
    new_tweets[i] = {
      text: element.text,
      created_at: element.created_at,
    }
  })
  return new_tweets
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    TwitterSync()
      .done((new_tweets) => {
        //console.log(new_tweets)
        resolve(new_tweets)
      }, () => {
        reject('There was an error with Twitter')
      })
  })
}

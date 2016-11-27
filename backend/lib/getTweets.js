var user_id = '25073877' // Trump user id

var Twit = require('twit')
var Promise = require('promise')

var Twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true
})

module.exports = (max_id = false, since_id = false, count = 5) => {
  var options = {
    user_id: user_id,
    trim_user: true,
    exclude_replies: true,
    include_rts: false,
    count: count
  }
  if (max_id)
    options.max_id = max_id
  if (since_id)
    options.since_id = since_id
  return new Promise((resolve, reject) => {
    Twitter.get('statuses/user_timeline', options, (err, data, resp) => {
      if (err) {
        console.log('There was an error connecting with Twitter...')
        reject(err)
      }
      else
        resolve(data)
    })
  })
}

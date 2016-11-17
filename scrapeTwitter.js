var user_id = '25073877' // Trump user id

var Twit = require('twit')
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')
var Promise = require('promise')
var JsonQuery = require('json-query')

var Twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true
})

var ToneAnalyzer = new ToneAnalyzerV3({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version_date: '2016-05-19'
})

var TwitterSync = () => {
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

var WatsonSync = (data) => {
  return new Promise((resolve, reject) => {
    ToneAnalyzer.tone({text: data.text}, (err, data, resp) => {
      if (err)
        reject(error)
      else
        resolve(processTone(data))
    })
  })
}

var WatsonBulk = (data) => {
  var promises = []
  data.forEach((element, i) => {
    promises.push(WatsonSync(element))
  })
  return Promise.all(promises)
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

function processTone(data) {
  return JsonQuery('tone_categories[category_id=emotion_tone].tones', {data: data.document_tone}).value
}

TwitterSync()
  .then(WatsonBulk)
  .then(function(data) {
    new_tweets.forEach((element, i) => {
      element.tone = data[i]
    })
    console.log(JSON.stringify(new_tweets))
  })

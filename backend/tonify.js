var Watson = require('watson-developer-cloud')
var Promise = require('promise')
var JsonQuery = require('json-query')

var ToneAnalyzer = new Watson.tone_analyzer({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version: 'v3',
  version_date: '2016-05-19'
})

function WatsonSync(data) {
  return new Promise((resolve, reject) => {
    ToneAnalyzer.tone({text: data.text}, (err, tone) => {
      if (err)
        reject(err)
      else
        resolve(JSON.stringify(tone, null, 2))
    })
  })
}

function WatsonBulk(data) {
  var promises = []
  data.forEach((element, i) => {
    promises.push(WatsonSync(element))
  })
  return Promise.all(promises)
}

function processTone(data) {
  return JsonQuery('tone_categories[category_id=emotion_tone].tones', {data: data.document_tone}).value
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    TwitterSync()
      // .then((data) => WatsonBulk(data))
      // .then((data) => {
      //   new_tweets.forEach((element, i) => {
      //     element.tone = data[i]
      //   })
      // })
      .done((new_tweets) => {
        resolve(new_tweets)
      }, () => {
        reject('There was an error')
      })
  })
}

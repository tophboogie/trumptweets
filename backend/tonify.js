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
  var promises = []
  data.forEach((element, i) => {
    promises.push(WatsonSyncSingle(element))
  })
  return Promise.all(promises)
}

function WatsonSyncSingle(data) {
  return new Promise((resolve, reject) => {
    ToneAnalyzer.tone({text: data.text}, (err, tone) => {
      if (err)
        reject(err)
      else
        resolve(processTone(tone))
    })
  })
}

function processTone(data) {
  var emotion = JsonQuery('tone_categories[category_id=emotion_tone].tones', {data: data.document_tone}).value
  var language = JsonQuery('tone_categories[category_id=language_tone].tones', {data: data.document_tone}).value
  var social = JsonQuery('tone_categories[category_id=social_tone].tones', {data: data.document_tone}).value
  return {emotion, language, social}
}

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    WatsonSync(data)
      .done((new_tones) => {
        resolve(new_tones)
      }, () => {
        reject('There was an error with Watson')
      })
  })
}

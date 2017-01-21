var Watson = require('watson-developer-cloud')
var Promise = require('promise')
var JsonQuery = require('json-query')

var ToneAnalyzer = new Watson.tone_analyzer({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version: 'v3',
  version_date: '2016-05-19'
})

module.exports = (text = '') => {
  return new Promise((resolve, reject) => {
    ToneAnalyzer.tone({text: text}, (err, res) => {
      if (err) {
        console.log('problems with watson')
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

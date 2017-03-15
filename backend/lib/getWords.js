var Tweet = require('../models/tweet.js')
var Words = require('../models/words.js')
var Mongoose = require('mongoose')
var Promise = require('promise')

Mongoose.connect('mongodb://localhost/tweets')
Mongoose.Promise = require('promise')

module.exports = (date) => {
  return new Promise((resolve, reject) => {
    Tweet.find({
      tweetDate: {
        $eq: date
      }})
      .sort('tweetDate')
      .select('_id tweetText')
      .exec(function (err, tweets) {
        if (err)
          console.log(err)
        else {
          console.log(tweets)
        }
      })
  })
}

//     Tweet.findOne({tweetId: id}, (err, data) => {
//       if (data && data.tweetText && data.tweetDate) {
//         // tweet exists
//         Tone.findOne({tweetId: id}, (err, tone) => {
//           console.log('looking for this tone for tweet ' + id)
//           if (err) {
//             reject(err)
//           } else if (tone) {
//             //tone already exists
//             console.log('already have this one')
//             resolve()
//           } else {
//             GetTone(data.tweetText).then((toneObj) => {
//               console.log('saving tweet ' + id)
//               saveToDB({
//                 tweetId: id,
//                 toneObj: toneObj,
//                 toneType: 'tweet',
//                 toneScores: processTone(toneObj),
//                 toneText: data.tweetText,
//                 toneTextDate: data.tweetDate
//               }).then((err) => {
//                 if (err) {
//                   reject(err)
//                 } else {
//                   resolve()
//                 }
//               })
//             })
//           }
//         }) // tone findOne
//       }
//     }) // tweet findOne
//   })
// }

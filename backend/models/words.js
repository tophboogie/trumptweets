var Mongoose = require('mongoose')
Mongoose.Promise = require('promise')

var WordsSchema = new Mongoose.Schema({
  wordsObj: Object,
  wordsDate: Date,
  _tweets: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  }
});

module.exports = Mongoose.model('Words', WordsSchema)

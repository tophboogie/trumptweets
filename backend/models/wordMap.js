var Mongoose = require('mongoose')
Mongoose.Promise = require('promise')

var WordMapSchema = new Mongoose.Schema({
  wordMapObj: Object,
  wordMapDate: {type: Date, unique: true},
  _tweets: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  }
});

module.exports = Mongoose.model('WordMap', WordMapSchema)

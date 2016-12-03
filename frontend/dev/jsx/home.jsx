import React from 'react'
import Axios from 'axios'

import Wordcloud from './wordcloud.jsx'
import removeStopWords from '../lib/stopwords.js'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      words: [
            "Hello", "world", "normally", "you", "want", "more", "words",
            "than", "this"].map(function(d) {
            return {text: d, size: 10 + Math.random() * 90};
          })
    }
  }
  componentDidMount() {
    Axios.get('http://localhost:3030/tweets')
      .then((resp) => {
        this.setState({
          tweets: resp.data,
          words: this.getWordArray(resp.data)
        })
      })
  }
  getWordArray(tweets) {
    var words = []
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var puncuationRegex = /[",;.!?':1234567890]/g
    tweets.forEach((tweet) => {
      var test = removeStopWords(tweet.tweetText.toLowerCase().trim())
      var tempWords = test.replace(urlRegex, '').replace(puncuationRegex,'')
      tempWords.split(/[\s\/]+/g).forEach((word) => {
        words.push(word)
      })
    })
    var wordMap = words.sort().reduce((prev, cur) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
    var wordMap2 = []
    for (var key in wordMap) {
      if (wordMap.hasOwnProperty(key)) {
        wordMap2.push({
          text: key,
          size: wordMap[key]
        })
      }
    }
    return wordMap2
  }
  render() {
    return (
      <div className="container gutter-top">
        <Wordcloud words={this.state.words} />
      </div>
    )
  }
}

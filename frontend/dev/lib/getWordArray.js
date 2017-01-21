import removeStopWords from './removeStopWords.js'

const getWordArray = (tweets) => {
  var words = []

  // remove urls
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  // remove other punctuation
  var puncuationRegex = /[",;.!?&':1234567890•\u2026-]+/g

  tweets.forEach((tweet) => {
    if (tweet && tweet.tweetText) {
      // remove stop words and run regexs from tweet string
      var tempWords = removeStopWords(
        tweet.tweetText.toLowerCase().trim()
        .replace(urlRegex, '')
        .replace(puncuationRegex,'')
      )

      // loop and create one array of words
      tempWords.split(/[\s\/]+/g).forEach((word) => {
        words.push(word)
      })
    }
  })

  // count each word
  var wordCount = words.sort().reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  // arrange as array of objects, remove words < 10
  var wordMap = []
  for (var key in wordCount) {
    if (wordCount.hasOwnProperty(key) && wordCount[key] > 2) {
      wordMap.push({
        text: key,
        size: wordCount[key]
      })
    }
  }

  return wordMap
}

export default getWordArray

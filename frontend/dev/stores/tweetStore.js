import {observable, action, asMap, useStrict} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'

const tweetStore = observable({
  allTweets: [],
  loadingTweets: false,
  loadingTweet: asMap(),
  hasBeenFetched: false,
  requestTweets: action (() => {
    tweetStore.loadingTweets = true
    tweetStore.getTweets()
  }),
  getTweetsSuccess: action((tweets) => {
    tweetStore.allTweets.replace(tweets)
    tweetStore.hasBeenFetched = true
  }),
  requestTone: action((id) => {
    tweetStore.loadingTweet.set(id, true) // sets a flag for this tweet id
    tweetStore.getTone(id)
  }),
  getToneSuccess: action((id, data) => {
    tweetStore.loadingTweet.delete(id)
    const tweet = tweetStore.allTweets.find((t) => t._id === id)
    const index = tweetStore.allTweets.indexOf(tweet)
    tweetStore.allTweets[index] = data
  })
})

// api stuff
tweetStore.getTweets = () => {
  get('http://localhost:3030/api')
    .then((resp) => {
      tweetStore.getTweetsSuccess(resp.data)
    })
}
tweetStore.getTone = (id) => {
  post('http://localhost:3030/api/tonify', {id})
    .then((resp) => {
      tweetStore.getToneSuccess(id, resp.data)
    })
}


export default tweetStore

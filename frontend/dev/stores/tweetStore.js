import {observable, action, asMap, useStrict} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'

const tweetStore = observable({
  allTweets: [],
  loadingTweets: asMap(),
  hasBeenFetched: false,
  getTweetsSuccess: action((tweets) => {
    tweetStore.allTweets.replace(tweets)
    tweetStore.hasBeenFetched = true
  }),
  getToneSuccess: action((id, data) => {
    tweetStore.loadingTweets.delete(id)
    const tweet = tweetStore.allTweets.find((tweet) => tweet._id === id)
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
tweetStore.getTone = (tweet) => {
  tweetStore.loadingTweets.set(tweet._id, true) // sets a flag for this tweet id
  post('http://localhost:3030/api/tonify', {id: tweet._id})
    .then((resp) => {
      tweetStore.getToneSuccess(tweet._id, resp.data)
    })
}


export default tweetStore

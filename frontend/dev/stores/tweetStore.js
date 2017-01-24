import {observable, action, asMap, useStrict} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'
import moment from 'moment'

import getWordArray from '../lib/getWordArray'

const tweetStore = observable({
  tweets: [],
  words: [],
  hasBeenFetched: false,
  getTweetsSuccess: action((tweets) => {
    tweetStore.tweets.replace(tweets)
    tweetStore.words.replace(getWordArray(tweets))
    tweetStore.hasBeenFetched = true
  }),
  getTweetsFailure: action(() => {
    tweetStore.error = 'something happened..'
  }),
  startDate: moment().subtract(30, 'days'),
  endDate: moment(),
  dateRangeFocusedInput: null,
  onDateRangeFocusChange: action((newFocus) => {
    tweetStore.dateRangeFocusedInput = newFocus
  }),
  onDatesChange: action(({startDate, endDate}) => {
    tweetStore.startDate = startDate
    tweetStore.endDate = endDate
    if (startDate && endDate) { tweetStore.getDateRange() }
  })
})

// api stuff
tweetStore.getTweets = () => {
  get('http://localhost:3030/tweets')
    .then((resp) => tweetStore.getTweetsSuccess(resp.data))
    .catch((err) => tweetStore.getTweetsFailure())
}

tweetStore.getDateRange = () => {
  get('http://localhost:3030/tweets/' + moment(tweetStore.startDate).format('D-M-YYYY') + '/to/' + moment(tweetStore.endDate).format('D-M-YYYY'))
    .then((resp) => tweetStore.getTweetsSuccess(resp.data))
    .catch((err) => tweetStore.getTweetsFailure())
}


export default tweetStore

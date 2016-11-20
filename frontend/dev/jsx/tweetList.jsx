import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

import Tweet from './tweet.jsx'

class TweetList extends Component {
  render() {
    const {allTweets, getTone, loadingTweets} = this.props.tweetStore
    return (
      <div className='tweet-list'>
        {allTweets.map((tweet) => {
          return (
            <Tweet
              key={tweet._id}
              tweet={tweet}
              getTone={getTone}
              loading={loadingTweets.get(tweet._id)}
            />
          )
        })}
      </div>
    )
  }
}

TweetList.propTypes = {
  tweetStore: PropTypes.object.isRequired
}

const TweetListWrapped = inject('tweetStore')(observer(TweetList))

export default TweetListWrapped

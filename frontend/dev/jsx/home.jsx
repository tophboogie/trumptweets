import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'
import TweetList from './tweetList.jsx'
import UglyFace from './uglyFace.jsx'
import WordCloud from './wordCloud.jsx'

class Home extends Component {
  componentDidMount() {
    const {hasBeenFetched, requestTweets} = this.props.tweetStore
    if (!hasBeenFetched) {
      requestTweets()
    }
  }
  render() {
    return (
      <div className='home'>
        <UglyFace />
        <WordCloud />
        <TweetList />
      </div>
    )
  }
}

Home.propTypes = {
  tweetStore: PropTypes.object.isRequired
}

const HomeWrapped = inject('tweetStore')(observer(Home))

export default HomeWrapped

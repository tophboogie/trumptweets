import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'
import TweetList from './tweetList.jsx'

class Home extends Component {
  componentDidMount() {
    const {hasBeenFetched, getTweets} = this.props.tweetStore
    if (!hasBeenFetched) {
      getTweets()
    }
  }
  render() {
    return (
      <div>
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

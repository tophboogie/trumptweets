import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'

import Wordcloud from '../components/wordcloud.jsx'
import WordcloudControls from '../components/wordcloudControls.jsx'

class Home extends Component {
  componentWillMount() {
    const {getTweets, hasBeenFetched} = this.props.tweetStore
    if (!hasBeenFetched) { getTweets() }
  }
  render() {
    const {words} = this.props.tweetStore
    console.log(words.slice())
    return (
      <div>
        <WordcloudControls />
        <Wordcloud words={words.slice()} />
      </div>
    )
  }
}

const HomeWrapped = inject('tweetStore')(observer(Home))

export default HomeWrapped

import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import EventListener from 'react-event-listener'

import WordcloudControls from '../components/wordcloudControls.jsx'

class Home extends Component {
  componentWillMount() {
    const {getTweets, hasBeenFetched} = this.props.tweetStore
    if (!hasBeenFetched) { getTweets() }
  }
  componentDidMount() {
    const {initWordcloud} = this.props.tweetStore
    initWordcloud()
  }
  render() {
    const {resizeWordcloud} = this.props.tweetStore
    return (
      <div>
        <EventListener target={window} onResize={resizeWordcloud} />
        <WordcloudControls />
        <div style={{position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, zIndex: -1}} id='dataview'></div>
      </div>
    )
  }
}

const HomeWrapped = inject('tweetStore')(observer(Home))

export default HomeWrapped

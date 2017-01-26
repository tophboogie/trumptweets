import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import EventListener from 'react-event-listener'

import WordcloudControls from '../components/wordcloudControls.jsx'

class Home extends Component {
  componentWillMount() {
    const {getDateRange, hasBeenFetched} = this.props.tweetStore
    if (!hasBeenFetched) { getDateRange() }
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
        <div className='fullscreen' id='dataview'></div>
      </div>
    )
  }
}

const HomeWrapped = inject('tweetStore')(observer(Home))

export default HomeWrapped

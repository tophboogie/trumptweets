import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import EventListener from 'react-event-listener'

import WordcloudWords from './_words'
import WordcloudControls from './_controls'
import WordcloudMessages from './_messages'
import WordcloudLoading from './_loading'

class WordcloudLayout extends Component {
  static propTypes = {
    person: PropTypes.string
  }
  render() {
    const {person} = this.props
    const {resizeWordcloud} = this.props.wordcloudStore
    // it's possible we get some kind styling later from the store - inline for now
    return (
      <div
        className='wordcloud_fullscreen'
        style={{background: '#090210'}}
      >
        <EventListener target={window} onResize={resizeWordcloud} />
        <WordcloudControls />
        <WordcloudWords person={person} />
        <WordcloudMessages />
        <WordcloudLoading />
      </div>
    )
  }
}

const ConnectWordcloudLayout = inject('wordcloudStore')(observer(WordcloudLayout))
export default ConnectWordcloudLayout

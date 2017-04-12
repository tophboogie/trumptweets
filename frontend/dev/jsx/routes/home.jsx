import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import EventListener from 'react-event-listener'

import Wordcloud from '../components/wordcloud.jsx'
import WordcloudControls from '../components/wordcloudControls.jsx'

class Home extends Component {
  componentWillMount() {
    const {init} = this.props.wordStore
    init()
  }
  render() {
    const {resizeWordcloud, wordsObjArray, wordcloudWidth, wordcloudHeight} = this.props.wordStore
    return (
      <div>
        <EventListener target={window} onResize={resizeWordcloud} />
        <WordcloudControls />
        <Wordcloud
          words={wordsObjArray}
          width={wordcloudWidth}
          height={wordcloudHeight}
        />
      </div>
    )
  }
}

const HomeWrapped = inject('wordStore')(observer(Home))
export default HomeWrapped

import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import EventListener from 'react-event-listener'

import Wordcloud from '../components/wordcloud.jsx'
import WordcloudControls from '../components/wordcloudControls.jsx'

@inject('wordcloudStore')
@observer class Home extends Component {
  componentWillMount() {
    const {init} = this.props.wordcloudStore
    init()
  }
  render() {
    const {resizeWordcloud, width, height, filteredWordsObjArray, loadingWords} = this.props.wordcloudStore
    return (
      <div>
        <EventListener target={window} onResize={resizeWordcloud} />
        <WordcloudControls />
        <Wordcloud width={width} height={height} words={filteredWordsObjArray} />
      </div>
    )
  }
}

export default Home

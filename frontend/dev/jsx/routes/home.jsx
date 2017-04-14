import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import EventListener from 'react-event-listener'

import Wordcloud from '../components/wordcloud.jsx'
import WordcloudLoading from '../components/wordcloudLoading.jsx'
import WordcloudControls from '../components/wordcloudControls.jsx'

@inject('wordcloudStore')
@observer class Home extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      init: PropTypes.func,
      resizeWordcloud: PropTypes.func
    })
  }
  componentWillMount() {
    const {init} = this.props.wordcloudStore
    init()
  }
  render() {
    const {resizeWordcloud} = this.props.wordcloudStore
    return (
      <div>
        <EventListener target={window} onResize={resizeWordcloud} />
        <WordcloudControls />
        <WordcloudLoading />
        <Wordcloud />
      </div>
    )
  }
}

export default Home

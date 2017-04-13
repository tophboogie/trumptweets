import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import EventListener from 'react-event-listener'

import WordcloudD3Renderer from '../components/wordcloudD3Renderer.jsx'
import WordcloudControls from '../components/wordcloudControls.jsx'

@inject('wordcloudStore')
@observer class Home extends Component {
  componentWillMount() {
    const {init} = this.props.wordcloudStore
    init()
  }
  render() {
    const {
      resizeWordcloud,
      width,
      height,
      d3CloudWords,
      loadingD3CloudWords,
      showLoading,
      showWords
    } = this.props.wordcloudStore

    return (
      <div>
        <EventListener target={window} onResize={resizeWordcloud} />
        <WordcloudControls />
        {showLoading &&
          <WordcloudD3Renderer
            what='loading'
            width={width}
            height={height}
            words={loadingD3CloudWords}
          />
        }
        {showWords &&
          <WordcloudD3Renderer
            what='words'
            width={width}
            height={height}
            words={d3CloudWords}
          />
        }
      </div>
    )
  }
}

export default Home

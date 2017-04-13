import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

import WordcloudD3Renderer from '../components/wordcloudD3Renderer.jsx'

@inject('wordcloudStore')
@observer class WordcloudLoading extends Component {
  static propTypes = {
    loadingD3CloudWords: PropTypes.array,
    showLoading: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number
  }
  render() {
    const {loadingD3CloudWords, showLoading, width, height} = this.props.wordcloudStore
    return (
      <div>
        {showLoading &&
          <WordcloudD3Renderer
            what='loading'
            width={width}
            height={height}
            words={loadingD3CloudWords.slice()}
          />
        }
      </div>
    )
  }
}

export default WordcloudLoading

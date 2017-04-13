import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

import WordcloudD3Renderer from '../components/wordcloudD3Renderer.jsx'

@inject('wordcloudStore')
@observer class Wordcloud extends Component {
  static propTypes = {
    d3CloudWords: PropTypes.object, // <-- this is a mobx array (which is an object...)
    showWords: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number
  }
  render() {
    const {d3CloudWords, showWords, width, height} = this.props.wordcloudStore
    return (
      <div>
        {showWords &&
          <WordcloudD3Renderer
            what='words'
            width={width}
            height={height}
            words={d3CloudWords.slice()}
          />
        }
      </div>
    )
  }
}

export default Wordcloud

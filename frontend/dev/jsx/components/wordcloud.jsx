import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

import WordcloudD3Renderer from '../components/wordcloudD3Renderer.jsx'

@inject('wordcloudStore')
@observer class Wordcloud extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      d3CloudWords: PropTypes.array,
      showWords: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number
    })
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

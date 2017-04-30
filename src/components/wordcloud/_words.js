import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

import D3Renderer from '../d3Renderer'

class WordcloudWords extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      d3CloudWords: PropTypes.array,
      showWordcloud: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number
    })
  }
  render() {
    const {d3CloudWords, showWordcloud, width, height} = this.props.wordcloudStore
    return (
      <div>
        {showWordcloud &&
          <D3Renderer
            tooltip
            width={width}
            height={height}
            words={d3CloudWords.slice()}
          />
        }
      </div>
    )
  }
}

const ConnectWordcloudWords = inject('wordcloudStore')(observer(WordcloudWords))
export default ConnectWordcloudWords

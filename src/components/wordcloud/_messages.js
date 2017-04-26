import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

import D3Renderer from '../d3Renderer'

class WordcloudMessage extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      messageD3CloudWords: PropTypes.array,
      showMessage: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number
    })
  }
  render() {
    const {messageD3CloudWords, showMessage, width, height} = this.props.wordcloudStore
    return (
      <div>
        {showMessage &&
          <D3Renderer
            width={width}
            height={height}
            words={messageD3CloudWords.slice()}
          />
        }
      </div>
    )
  }
}

const ConnectWordcloudMessage = inject('wordcloudStore')(observer(WordcloudMessage))
export default ConnectWordcloudMessage

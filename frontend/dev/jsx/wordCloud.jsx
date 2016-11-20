import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

class WordCloud extends Component {
  render() {
    const {selectedText} = this.props.tweetStore
    return (
      <div className='word-cloud'>

      </div>
    )
  }
}

WordCloud.propTypes = {
  tweetStore: PropTypes.object.isRequired
}

const WordCloudWrapped = inject('tweetStore')(observer(WordCloud))

export default WordCloudWrapped

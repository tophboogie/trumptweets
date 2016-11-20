import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

class WordCloud extends Component {
  render() {
    const {selectedTweetText} = this.props.tweetStore
    const {selectedSpeechText} = this.props.speechStore
    return (
      <div className='word-cloud'>

      </div>
    )
  }
}

WordCloud.propTypes = {
  tweetStore: PropTypes.object.isRequired,
  speechStore: PropTypes.object.isRequired
}

const WordCloudWrapped = inject('tweetStore', 'speechStore')(observer(WordCloud))

export default WordCloudWrapped

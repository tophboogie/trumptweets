import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'mobx-react'

import wordcloudStore from '../../stores/wordcloud'
import WordcloudLayout from './_layout'
import './styles.css'

class Wordcloud extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  }
  render() {
    const {params} = this.props.match
    return (
      <Provider wordcloudStore={wordcloudStore}>
        <WordcloudLayout {...params} />
      </Provider>
    )
  }
}

export default Wordcloud

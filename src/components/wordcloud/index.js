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
    const {person} = this.props.match.params
    return (
      <Provider wordcloudStore={wordcloudStore}>
        <WordcloudLayout person={person} />
      </Provider>
    )
  }
}

export default Wordcloud

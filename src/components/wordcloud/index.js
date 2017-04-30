import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'mobx-react'

import wordcloudStore from '../../stores/wordcloud'
import WordcloudContainer from './_container'
import './styles.css'

class Wordcloud extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }),
    history: PropTypes.object.isRequired
  }
  render() {
    const {history} = this.props
    const {params} = this.props.match
    return (
      <Provider wordcloudStore={wordcloudStore}>
        <WordcloudContainer history={history} {...params} />
      </Provider>
    )
  }
}

export default Wordcloud

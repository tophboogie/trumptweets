import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

import WordcloudLayout from './_layout'

class WordcloudContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    person: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    wordcloudStore: PropTypes.shape({
      sync: PropTypes.func,
      init: PropTypes.func
    })
  }
  componentWillMount() {
    const {init} = this.props.wordcloudStore
    const {person, start, end, history} = this.props
    init({history, person, start, end})
  }
  componentWillReceiveProps(nextProps) {
    const {sync} = this.props.wordcloudStore
    const {person, start, end} = nextProps
    sync({person, start, end})
  }
  render() {
    return <WordcloudLayout />
  }
}

const ConnectWordcloudContainer = inject('wordcloudStore')(observer(WordcloudContainer))
export default ConnectWordcloudContainer

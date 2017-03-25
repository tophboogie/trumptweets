import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

import ToneBody from '../components/toneBody.jsx'

class Tone extends Component {
  componentWillMount() {
    const {getTone} = this.props.toneStore
    getTone()
  }
  render() {
    const {loading, tone} = this.props.toneStore
    return (
      <div >
        {loading ? <span>loading...</span> : null}
        <ToneBody />
      </div>
    )
  }
}

Tone.propTypes = {
  toneStore: PropTypes.object.isRequired
}

const ToneWrapped = inject('toneStore')(observer(Tone))

export default ToneWrapped

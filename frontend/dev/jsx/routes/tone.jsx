import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

class Tone extends Component {
  componentWillMount() {
    const {getTone} = this.props.toneStore
    getTone()
  }
  render() {
    const {loadingTone, tone} = this.props.toneStore
    return (
      <div>
        {loadingTone
          ? <span>loading...</span>
          : <span>tone</span>
        }
      </div>
    )
  }
}

Tone.propTypes = {
  toneStore: PropTypes.object.isRequired
}

const ToneWrapped = inject('toneStore')(observer(Tone))

export default ToneWrapped

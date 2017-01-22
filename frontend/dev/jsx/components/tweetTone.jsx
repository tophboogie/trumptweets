import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'

class TweetTone extends Component {
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

TweetTone.propTypes = {
  toneStore: PropTypes.object.isRequired
}

const TweetToneWrapped = inject('toneStore')(observer(TweetTone))

export default TweetToneWrapped

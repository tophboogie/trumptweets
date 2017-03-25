import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'

import '../../scss/tone.scss'
import ToneEmotion from './toneEmotion.jsx'

import {emojions} from '../../lib/emoji'

class ToneBody extends Component {
  render() {
    const {tone} = this.props.toneStore

    return (
      <div className='tone-body'>
        <ToneEmotion scores={tone.toneScores} />
      </div>
    )
  }
}

const ToneBodyWrapped = inject('toneStore')(observer(ToneBody))

export default ToneBodyWrapped

import React, {Component, PropTypes} from 'react'

class ToneEmotion extends Component {
  render() {
    const {toneScores} = this.props
    let highestValue
    if (toneScores && toneScores.emotion) {
      const scores = toneScores.emotion.map((e) => e.score)
      highestValue = Math.max.apply(Math, scores)
    }
    return (
      <div>
        {highestValue}
      </div>
    )
  }
}

ToneEmotion.propTypes = {
  scores: PropTypes.object.isRequired
}

export default ToneEmotion

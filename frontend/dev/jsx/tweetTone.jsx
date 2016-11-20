import React, {Component, PropTypes} from 'react'

class TweetTone extends Component {
  render() {
    const {tone} = this.props
    return (
      <div style={{fontSize: '16px', marginBottom: '15px'}}>
        {
          tone.emotions.sort((a, b) => b.score - a.score)
                       .map((emotion) => emotion.tone_name + ' (' + Math.floor(emotion.score*100) + '%)')
                       .join(', ')
        }
      </div>
    )
  }
}

TweetTone.propTypes = {
  tone: PropTypes.object.isRequired
}

export default TweetTone

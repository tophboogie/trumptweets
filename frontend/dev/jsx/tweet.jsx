import React, {Component, PropTypes} from 'react'

import Emotion from './emotion.jsx'

class Tweet extends Component {
  render() {
    const tweet = this.props.tweet
    const colors = [
      'progress-bar-danger',
      'progress-bar-warning',
      'progress-bar-info',
      'progress-bar-success',
      'progress-bar-primary'
    ]
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">Tweeted on: {tweet.date}</h2>
        </div>
        <div className="panel-body">
          <p>{tweet.text}</p>
          <hr />
          <h4>Emotional Data:</h4>
          {tweet.tone.emotion.map((emotion, i) => {
            return (
              <Emotion
                key={i}
                title={emotion.tone_name}
                score={emotion.score}
                colorClass={colors[i]}
              />
            )
          })}
          <h4>Language Data:</h4>
          {tweet.tone.language.map((emotion, i) => {
            return (
              <Emotion
                key={i}
                title={emotion.tone_name}
                score={emotion.score}
                colorClass={colors[i]}
              />
            )
          })}
          <h4>Social Data:</h4>
          {tweet.tone.social.map((emotion, i) => {
            return (
              <Emotion
                key={i}
                title={emotion.tone_name}
                score={emotion.score}
                colorClass={colors[i]}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

Tweet.propTypes = {
  tweet: PropTypes.object.isRequired
}

export default Tweet

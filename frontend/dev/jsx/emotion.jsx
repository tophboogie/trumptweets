import React, {Component, PropTypes} from 'react'

class Emotion extends Component {
  render() {
    const percent = Math.round(this.props.score * 100)
    return (
      <div className="row">
        <div className="col-xs-2">
          <p>{this.props.title}</p>
        </div>
        <div className="col-xs-10">
          <div className="progress">
            <div className={`progress-bar ${this.props.colorClass}`} role="progressbar" aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style={{width: percent + '%', minWidth: '2em'}}>
              <span>{percent}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Emotion.propTypes = {
  title: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
}

export default Emotion

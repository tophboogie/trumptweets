import React, {Component, PropTypes} from 'react'

class Tweet extends Component {
  render() {
    const {tweet, getTone, loading} = this.props
    if (tweet.tone) { console.log(tweet.tone)}
    return (
      <div style={{fontSize: '16px', marginBottom: '15px'}}>
        <div>{tweet.text}</div>
        <div>
          {tweet.tone
            ? <span>{tweet.tone}</span>
            : <button disabled={loading} onClick={() => getTone(tweet)}>get tone</button>
          }
          {loading
            ? <span>loading...</span>
            : null
          }
        </div>
      </div>
    )
  }
}

Tweet.propTypes = {
  tweet: PropTypes.object.isRequired,
  getTone: PropTypes.func,
  loading: PropTypes.bool
}

export default Tweet

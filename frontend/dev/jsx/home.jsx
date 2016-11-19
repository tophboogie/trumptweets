import React from 'react'
import Axios from 'axios'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: []
    }
  }
  componentDidMount() {
    Axios.get('http://localhost:3030/api')
      .then((resp) => {
        this.setState({
          tweets: resp.data
        })
      })
  }
  render() {
    var tweets = this.state.tweets
    var key = 0
    console.log(tweets)
    return (
      <div>
        {tweets.map((tweet) => {
          key++
          return (
            <p key={key}>{tweet.text}</p>
          )
        })}
      </div>
    )
  }
}

import React from 'react'
import Axios from 'axios'

import Tweet from './tweet.jsx'

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
    return (
      <div className="container gutter-top">
        {this.state.tweets.map((tweet, i) => {
          return (
              <Tweet
                key={i}
                tweet={tweet}
              />
          )
        })}
      </div>
    )
  }
}

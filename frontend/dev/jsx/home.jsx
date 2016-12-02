import React from 'react'
import Axios from 'axios'

import Wordcloud from './wordcloud.jsx'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: []
    }
  }
  componentDidMount() {
    Axios.get('http://localhost:3030/tweets')
      .then((resp) => {
        this.setState({
          tweets: resp.data
        })
      })
  }
  render() {
    //console.log(this.state.tweets)
    return (
      <div className="container gutter-top">
        <Wordcloud tweets={this.state.tweets} />
      </div>
    )
  }
}

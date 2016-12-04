import React from 'react'
import Axios from 'axios'

import Wordcloud from './wordcloud.jsx'
import getWordArray from '../lib/getWordArray.js'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      words: []
    }
  }
  componentDidMount() {
    Axios.get('http://localhost:3030/tweets')
      .then((resp) => {
        this.setState({
          tweets: resp.data,
          words: getWordArray(resp.data)
        })
      })
  }
  render() {
    return (
      <Wordcloud words={this.state.words} />
    )
  }
}

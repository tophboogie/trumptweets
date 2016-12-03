import React from 'react'
import createWordcloud from './d3/wordcloud.js'
import rd3 from 'react-d3-library'
const RD3Component = rd3.Component

class Wordcloud extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      d3: ''
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      d3: createWordcloud(props.words)
    })
  }
  render() {
    return (
      <RD3Component data={this.state.d3} />
    )
  }
}

export default Wordcloud

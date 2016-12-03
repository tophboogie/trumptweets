import React from 'react'
import node from './d3/test.js'
import rd3 from 'react-d3-library'
const RD3Component = rd3.Component

class Wordcloud extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      d3: ''
    }
  }
  componentDidMount() {
    this.setState({
      d3: node
    })
  }
  render() {
    return (
      <div>
        <RD3Component data={this.state.d3} />
      </div>
    )
  }
}

export default Wordcloud

import React from 'react'

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div className="container">
        {this.props.children}
      </div>
    )
  }
}

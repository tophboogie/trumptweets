import React from 'react'

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div className="container-fluid gutter-top">
        {this.props.children}
      </div>
    )
  }
}

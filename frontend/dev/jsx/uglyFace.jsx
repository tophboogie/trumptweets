import React, {Component, PropTypes} from 'react'

class UglyFace extends Component {
  render() {
    const {emotion} = this.props
    return (
      <div className='ugly-face'>
        ugly face
      </div>
    )
  }
}

UglyFace.propTypes = {
  emotion: PropTypes.object
}

export default UglyFace

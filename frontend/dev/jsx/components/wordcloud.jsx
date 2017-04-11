import React, {Component} from 'react'
import {toJS} from 'mobx'

class Wordcloud extends Component {
  render () {
    return (
      <div className='fullscreen'>
        <div id='dataview'></div>
      </div>
    )
  }
}

export default Wordcloud

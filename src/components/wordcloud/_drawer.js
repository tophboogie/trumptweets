import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

import WordcloudControls from './_controls'

class Drawer extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      drawerOpen: PropTypes.boolean
    })
  }
  render() {
    const {drawerOpen} = this.props.wordcloudStore
    const printClass = drawerOpen ? 'open' : ''
    return (
      <div className={`drawer ${printClass}`}>
        <WordcloudControls />
      </div>
    )
  }
}

const ConnectDrawer = inject('wordcloudStore')(observer(Drawer))
export default ConnectDrawer

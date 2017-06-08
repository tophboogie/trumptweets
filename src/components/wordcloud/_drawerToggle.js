import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

class DrawerToggle extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      drawerOpen: PropTypes.boolean,
      drawerToggle: PropTypes.func
    })
  }
  render() {
    const {
      drawerOpen,
      drawerToggle
    } = this.props.wordcloudStore
    const printClass = drawerOpen ? 'open' : ''
    return (
      <div className={`drawer_toggle_btn ${printClass}`} onClick={drawerToggle}>
        <span className='sr-only'>Toggle Controls</span>
        <span className='bar1'></span>
        <span className='bar2'></span>
        <span className='bar3'></span>
      </div>
    )
  }
}

const ConnectDrawerToggle = inject('wordcloudStore')(observer(DrawerToggle))
export default ConnectDrawerToggle

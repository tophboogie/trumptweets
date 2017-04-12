import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory} from 'react-router'
import {Provider} from 'mobx-react'

// styles
import '../scss/global.scss'

//stores
import wordStore from '../stores/wordStore'

// components
import Home from './routes/home.jsx'

ReactDOM.render((
  <Provider wordStore={wordStore}>
    <Router history={hashHistory}>
      <Route path='/' component={Home} />
    </Router>
  </Provider>
), document.getElementById('app'))

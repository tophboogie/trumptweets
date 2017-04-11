import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import {Provider} from 'mobx-react'

// styles
import '../scss/global.scss'

//stores
import WordStore from '../stores/wordStore'

// components
import Container from './components/container.jsx'
import Home from './routes/home.jsx'

ReactDOM.render((
  <Provider wordStore={new WordStore()}>
    <Router history={hashHistory}>
      <Route path='/' component={Container}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))

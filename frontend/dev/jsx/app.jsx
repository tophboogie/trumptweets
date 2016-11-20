import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import {Provider} from 'mobx-react'

// styles
import '../scss/global.scss'
import '../scss/containers.scss'

//stores
import tweetStore from '../stores/tweetStore'
import speechStore from '../stores/speechStore'

// components
import Container from './container.jsx'
import Home from './home.jsx'

ReactDOM.render((
  <Provider tweetStore={tweetStore} speechStore={speechStore}>
    <Router history={hashHistory}>
      <Route path="/" component={Container}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))

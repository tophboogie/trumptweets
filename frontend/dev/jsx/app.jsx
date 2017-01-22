import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import {Provider} from 'mobx-react'

// styles
import '../scss/global.scss'

//stores
import tweetStore from '../stores/tweetStore'
import toneStore from '../stores/toneStore'

// components
import Container from './layout/container.jsx'
import Home from './home.jsx'
import TweetTone from './components/tweetTone.jsx'

ReactDOM.render((
  <Provider tweetStore={tweetStore} toneStore={toneStore}>
    <Router history={hashHistory}>
      <Route path='/' component={Container}>
        <IndexRoute component={Home} />
        <Route path="tone" component={TweetTone}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))

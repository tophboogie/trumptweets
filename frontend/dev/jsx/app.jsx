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
import Home from './routes/home.jsx'
import Tone from './routes/tone.jsx'

ReactDOM.render((
  <Provider tweetStore={tweetStore} toneStore={toneStore}>
    <Router history={hashHistory}>
      <Route path='/' component={Container}>
        <IndexRoute component={Home} />
        <Route path="tone" component={Tone}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))

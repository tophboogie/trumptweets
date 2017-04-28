import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
// <Redirect from={'/'} to={'/trump'} />

import Wordcloud from './wordcloud'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={'/'} component={Wordcloud} />
      <Route exact path={'/:person'} component={Wordcloud} />
      <Route exact path={'/:person/:start/to/:end'} component={Wordcloud} />
    </Switch>
  </BrowserRouter>
)

export default Routes

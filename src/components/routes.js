import React from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import Wordcloud from './wordcloud'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={'/'} component={Wordcloud} />
      <Route exact path={'/:person'} component={Wordcloud} />
      <Route exact path={'/:person/:start'} component={Wordcloud} />
      <Route exact path={'/:person/:start/to/:end'} component={Wordcloud} />
      <Redirect to={'/'} />
    </Switch>
  </BrowserRouter>
)

export default Routes

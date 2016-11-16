import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/App.jsx';
import Shooter from '../../ui/Shoot.jsx';
import Home from '../../ui/Home.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
  <Route path="/" component={Home} />
  <Route path="/admin" component={AppContainer}>
      <Route path=":path" component={AppContainer}/>
  </Route>
   <Route path='shoot' component={Shooter} />

  </Router>
);
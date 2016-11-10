import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/App.jsx';
import Shooter from '../../ui/Shoot.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/admin" component={AppContainer}>
    </Route>
   <Route path='shoot' component={Shooter} />

  </Router>
);
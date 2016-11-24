import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/App.jsx';
//import Shooter from '../../ui/Shoot.jsx';
import Uploader from '../../ui/Upload.jsx';
import Home from '../../ui/Home.jsx';
import Share from '../../ui/Share.jsx';
import Signin from '../../ui/User.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
  <Route path="/" component={Home} />
  <Route path='signin' component={Signin} />

  <Route path="/admin" component={AppContainer}>
      <Route path=":path" component={AppContainer}/>
  </Route>
  <Route path='shoot' component={Uploader} />
  <Route path='share' component={Share} >
    <Route path="/share/:fpath" component={Share}/>
  </Route>
  </Router>
);
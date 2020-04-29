import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import { Home } from '../../components';
import{List} from '../../components';

const App = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/view/:slugText" component={List}/>
    </Switch>
  )
}

export default withRouter(App);
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import Auth from './components/Auth';
import Main from './components/Main';
import Registration from "./components/Registration";
import Transactions from './components/Transactions';

class Router extends React.Component {
  render() {
    return (
          <Switch>
            <Route exact path='/' component={Main}/>
            <Route path='/auth' component={Auth}/>
            <Route path='/registration' component={Registration}/>
            <Route path='/transaction' component={Transactions}/>
            <Route render={() => <Redirect to="/" />} />
          </Switch>
    )
  }
}

export default Router;

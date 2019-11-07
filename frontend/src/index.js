import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './components/App';
import PageNotFound from './components/PageNotFound';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="*" component={PageNotFound} status={404} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);

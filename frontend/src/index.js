import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';

import App from './App';
import { auth, user } from './state';

const documentElement = document.getElementById('ReactApp');

if (!documentElement) {
  throw Error('React document element not found');
}

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const stores = {
  auth,
  route: routingStore,
  user,
};
const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  documentElement,
);

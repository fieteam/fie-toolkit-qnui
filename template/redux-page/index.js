'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import createStore from './store/index';
import reducers from './reducers/index';
import './index.scss';

const store = createStore(reducers);

// 创建一个与store事件同步的history对象
const history = syncHistoryWithStore(hashHistory, store);

ReactDom.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('container')
);

'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from 'components/layout/index';
import Home from './containers/home/index';
import Page1 from './containers/page1/index';
import Page2 from './containers/page2/index';

let pageTitle = document.title;

/**
 * menu 选中态map,其中value为side-menu组件中的itemid
 */
const menuMap = {
  '/home': 'router-home',
  '/page1': 'router-page1',
  '/page2': 'router-page2'
}

const onRouteEnter = (nextState, replace, callback) => {
  callback();
  //根据路由设置菜单选中
  let routePath = nextState.location.pathname;
  window.selectedMenuKey = menuMap[routePath];
};
const onRouteChange = (prevState, nextState, replace, callback) => {
  callback();
  document.title = nextState.routes[1].title || pageTitle;
  
    //根据路由设置菜单选中
  let routePath = nextState.location.pathname;
  window.selectedMenuKey = menuMap[routePath];
};

export default (<Route path="/" component={Layout} onEnter={onRouteEnter} onChange={onRouteChange}>
  <Route path="index" component={Home} title="index" />
  <Route path="page1" component={Page1} title="page1"/>
  <Route path="page2" component={Page2} title="page2"/>
  <IndexRoute component={Home}/>
  <Route path="*" component={Home}/>
</Route>);

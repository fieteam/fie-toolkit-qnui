'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import setSpm from '@alife/set-spm';

import Layout from 'components/layout/index';
import Home from './containers/home/index';
import Page1 from './containers/page1/index';
import Page2 from './containers/page2/index';

let pageTitle = document.title;

const menuMap = {
  '/home': 'router-home',
  '/page1': 'router-page1',
  '/page2': 'router-page2'
}

const onRouteEnter = (nextState, replace, callback) => {
  callback();
  setSpm(nextState.routes[1].spm);
  //根据路由设置菜单选中
  let routePath = nextState.location.pathname;
  window.selectedMenuKey = menuMap[routePath];
};
const onRouteChange = (prevState, nextState, replace, callback) => {
  callback();
  setSpm(nextState.routes[1].spm);
  document.title = nextState.routes[1].title || pageTitle;
  //根据路由设置菜单选中
  let routePath = nextState.location.pathname;
  window.selectedMenuKey = menuMap[routePath];
};


/**
 * 注意,单页面应用无法正常统计出每个单页面的PV/UV. 需要在Router上设置spm.
 * 如: <Route path="page1" component={Page1} spm={'a1z8w.8005215'} />
 * 具体请参考:http://mpm.alibaba.net/doc?group=alife&id=165514&name=set-spm
 * 有疑问请联系: @一桥/@宇果
 */
export default (<Route path="/" component={Layout} onEnter={onRouteEnter} onChange={onRouteChange}>
  <Route path="index" component={Home} title="index" />
  <Route path="page1" component={Page1} title="page1"/>
  <Route path="page2" component={Page2} title="page2"/>
  <IndexRoute component={Home}/>
  <Route path="*" component={Home}/>
</Route>);

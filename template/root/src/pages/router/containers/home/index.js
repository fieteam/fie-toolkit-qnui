'use strict';

import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/home';

import './index.scss';

class Home extends React.Component {

  render() {
    return (
      <div className="redux-demo-home">
        <div className="words">
          <span>当前页面为 redux + react-router 的案例页面， 这里是home路由页 </span>
        </div>
      </div>
    );
  }
}

export default connect((state)=> {
  return {
    home: state.home
  };
})(Home);

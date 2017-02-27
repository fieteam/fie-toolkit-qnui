'use strict';

import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/develpingFileName';
import './index.scss';

class developingClassName extends React.Component {
  render() {
    return (
      <div className="develpingFileName-page">
        developingClassName路由页面
      </div>
    );
  }
}


export default connect((state)=> {
  return {
    develpingVarName: state.develpingVarName
  }
})(developingClassName);

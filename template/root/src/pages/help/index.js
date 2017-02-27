'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class Help extends React.Component {
  render() {
    return <div className="help-page">
      <div className="tip-text">
        <span>这是一个简单的页面,不加通用layout的页面,您可以自由发挥</span>
      </div>
    </div>;
  }
}

ReactDOM.render(<Help />, document.getElementById('container'));


'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class developingClassName extends React.Component {
  render() {
    return <div className="develpingFileName-page">
      <div className="tip-text">
        <span>develpingFileName - 这是一个简单的页面,不加通用layout的页面,您可以自由发挥</span>
      </div>
    </div>;
  }
}

ReactDOM.render(<developingClassName />, document.getElementById('container'));


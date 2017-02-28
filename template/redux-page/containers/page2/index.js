'use strict';

import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/page2';
import {Button} from 'qnui';
import './index.scss';

class Page2 extends React.Component {

  constructor(props) {

    super(props);
  }

  handleClick() {
    var { dispatch, page2 } = this.props;

    dispatch(actions.getList(page2.counter + 1));

  }

  render() {

    var { list } = this.props.page2;

    return (
      <div className="page2-page">
        <p>
          <Button onClick={this.handleClick.bind(this)}>加载列表</Button>
        </p>
        <p>
          {list.map((item, index) => {
            return <span className="result" key={index}>{item}</span>;
          })}
        </p>
      </div>
    );
  }
}


// map state to props
export default connect((state)=> {
  return {
    page2: state.page2
  };
})(Page2);

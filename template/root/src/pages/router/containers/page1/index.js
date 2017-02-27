'use strict';

import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/page1';
import { Button } from 'qnui';
import './index.scss';

class Page1 extends React.Component {

  handleClick() {

    var { dispatch,  page1} = this.props;
    dispatch(actions.addText(`文本${page1.list.length + 1}`));
  }

  render() {

    var { list } = this.props.page1;

    return (
        <div className="page1-page">
          {/* spm埋点 c位只要页面内唯一即可 */}
          <div data-spm="1">
            <p>
              <Button onClick={this.handleClick.bind(this)}>添加文本</Button>
            </p>
            <p>
              { list.map((item, index) => {
                return <span className="result" key={index}>{item}</span>;
              })}
            </p>
          </div>
          <div data-spm="2">
            <a href="http://www.taobao.com" target="_blank">我是个链接</a>
          </div>
        </div>
    );
  }
}


export default connect((state)=> {
  return {
    page1: state.page1
  };
})(Page1);

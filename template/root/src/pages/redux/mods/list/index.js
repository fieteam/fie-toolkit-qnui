'use strict';

import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import { Button, Feedback } from 'qnui';

import './index.scss';

class List extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      loading: false
    }
  }

  handleClick() {
    var { dispatch, list, counter } = this.props;

    if( this.loading) {
      return false;
    }

    this.setState({
      loading: true
    });
    dispatch(actions.getList(counter + 1, ()=>{
      this.setState({
        loading: false
      });
    }, json => {
      this.setState({
        loading: false
      });
      Feedback.Toast.error({
        content: json.msg
      });
    }));

  }

  render() {

    var list = this.props.list;

    return (
      <div className="list-page">
        <p>
          一个使用了redux的页面
        </p>
        <p>
          <Button onClick={this.handleClick.bind(this)}>加载列表</Button>
          {this.state.loading ? <span className="loading-text">加载中...</span> : ''}
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
  return state;
})(List);

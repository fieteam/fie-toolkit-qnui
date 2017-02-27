'use strict';

import { ajax, nameSpace} from 'utils/index';

let ns = nameSpace('Index');
export const GET_LIST_SUCCESS = ns('GET_LIST_SUCCESS');

export function getList( counter, sucCallback, failCallback) {

  return (dispatch) => {

    //接收到数据
    ajax({
      api: 'page2List',
      method: 'GET',
    }, json => {

      dispatch({
        type: GET_LIST_SUCCESS,
        data: {
        	list: json.data.list,
        	counter: counter
        }
      });
      sucCallback(json);

    }, json => {

      failCallback(json);
    });

  };
}



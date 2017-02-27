'use strict';

import { ajax, nameSpace} from 'utils/index';

let ns = nameSpace('<{%= className %}>');
export const GET_DATA = ns('GET_DATA');

export function getData(data) {
  return (dispatch) => {
    dispatch({
      type: GET_DATA,
      data: data
    })
  }
}



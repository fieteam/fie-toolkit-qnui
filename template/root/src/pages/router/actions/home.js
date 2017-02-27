'use strict';

// constants 与 actions 在一起
import { ajax, nameSpace} from 'utils/index';

let ns = nameSpace('HOME');
export const GET_DATA = ns('GET_DATA');

export function getData() {
  return (dispatch) => {
    dispatch({
      type: GET_DATA,
      data: 'home'
    });
  };
}



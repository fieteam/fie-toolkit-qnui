'use strict';

import { nameSpace } from 'utils/index';

let ns = nameSpace('Page1');
export const ADD_TEXT = ns('ADD_TEXT');

export function addText(text) {
  return {
    type: ADD_TEXT,
    data: text
  };
}



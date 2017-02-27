'use strict';

const os = require('os');

module.exports = () => {
  if (os.userInfo && os.userInfo().homedir) {
    return os.userInfo().homedir;
  } else if (os.homedir) {
    return os.homedir();
  }
  return process.env.HOME;
};

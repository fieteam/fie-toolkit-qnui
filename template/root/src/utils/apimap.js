'use strict';

/**
 * API MAP 对象
 * 页面上所有ajax请求统一在这里管理.
 */
export default {
  //本地开发环境,一般可以mock数据
  local : {
    /*invoke*/
    home : "/data/home.json",
    page2List:"/data/page2List.json"
  },
  //daily环境,可重写base定义的接口
  development:{
    //
  },
  //线上环境
  production:{
    //这里填入线上的host
    _HOST:"//lbs.taobao.com"
  }
}
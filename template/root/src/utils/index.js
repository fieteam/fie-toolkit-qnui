'use strict';
import apimap from './apimap';
import reqwest from 'reqwest';
/*apienv的可选值 local,development,production */
const apienv = window.apienv || 'local';
var Tools = {
  ajax: function (param, suc, err) {
    /*在demo html中修改window.apienv实现不同环境的数据接口切换*/
    param.url = apimap[apienv][param.api];
    param.type = 'json';
    var startTime = new Date().getTime();
    return reqwest(param).then((res)=>{
      var endTime = new Date().getTime();
      if(res.code === 200){//默认接口请求成功的判断条件，可以自行修改,也可以按照自己约定来做判断
          suc && suc(res);
          console.log(`接口请求成功`,res);
      }else {//在这里可以统一自定义错误返回码异常处理
        //TODO:接口统一异常处理
          err && err(res);
          console.error(`接口请求失败`,res);
      }
      return res;
    }).catch((error)=>{ //接口异常处理，返回response.status 非20x或者1223时会进入这里
      var endTime = new Date().getTime();
        throw new Error(`接口${param.api}调用失败！服务端异常！${error.message}`);
    })
  },

  isLocal(){
    var host = window.location.host;
    return host.indexOf('127.0.0.1') > -1 || host.indexOf('localhost') > -1;
  },
  getUrlParam: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = decodeURIComponent(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },

  isArray: function(object) {
    return object instanceof Array;
  },
  isWindow: function(obj) {
    return obj != null && obj == obj.window;
  },
  isDocument: function(obj) {
    return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
  },
  isObject: function(obj) {
    return this._type(obj) == 'object';
  },
  isFunction: function(fn) {
    return this._type(fn) == 'function';
  },
  isPlainObject: function(obj) {
    return this.isObject(obj) && !this.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
  },
  _type: function(obj) {
    var class2type = {};
    var toString = class2type.toString;
    return obj == null ? String(obj) :
    class2type[toString.call(obj)] || 'object';
  },
  isString: function(str) {
    return typeof str === 'string';
  },
  extend: function(target, source) {
    target = target || {};
    source = source || {};
    for (var key in source) {
      target[key] = source[key];
    }
    return target;

  },
  namespace: function(name) {
    return function(v) {
      return name + '-' + v;
    };
  },
  formatDate: function(date, fmt) {
    if (this.isObject(date) == false) {
      return date;
    }
    date = new Date(date);
    //console.log('date：' + date);
    if (fmt === undefined) {
      fmt = 'yyyy-MM-dd hh:mm:ss';
    }
    var o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S': date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
  }
};
export const ajax = Tools.ajax.bind(Tools)
export const nameSpace = Tools.namespace.bind(Tools);
export default Tools;

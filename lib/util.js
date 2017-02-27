'use strict';

let path = require('path');
let fs = require('fs');
let esprima = require('esprima');
let esquery = require('esquery');
let escodegen = require('escodegen');
let debug = require('debug')('fie-toolkit-next');
let templateDir = path.resolve(__dirname, '../template/');
let cwd = process.cwd();

function firstUpperCase(str) {
  return str.replace(/^\S/, function(s) {
    return s.toUpperCase();
  });
}

function camelTrans(str, isBig) {

  let i = isBig ? 0 : 1;
  str = str.split('-');
  for (; i < str.length; i++) {
    str[i] = firstUpperCase(str[i]);
  }
  return str.join('');
}

/**
 * 获取gitlab相关信息
 */
function getProjectInfo() {
  var file = path.join(cwd, 'package.json');
  var pkg;
  var name;
  if (fs.existsSync(file)) {
    pkg = require(file);
    if (pkg.repository && pkg.repository.url) {
      var match = pkg.repository.url.match(/git@gitlab.alibaba-inc.com:(.*)\.git/);
      if (match && match[1]) {
        name = match[1];
      }
    }
  }
  return name;
}

let utils = {


  /**
   * 用户输入的是用横杠连接的名字
   * 根据用户输入的name生成各类规格变量名: 横杠连接,小驼峰,大驼峰,全大写
   */
  generateNames: function(name) {

    return {
      //横杠连接
      fileName: name,

      //小驼峰
      varName: camelTrans(name),

      //大驼峰
      className: camelTrans(name, true),

      //全大写
      constName: name.split('-').join('').toUpperCase(),

      projectInfo : getProjectInfo()
    };
  },

  getTemplateDir: function(type) {

    return type ? path.resolve(templateDir, type) : templateDir;
  },

  getCwd: function() {

    return cwd;

  },

  /**
   * 分析一下fie.config.js,将spm相关信息写入
   * @param code
   */
  analyzeFieConfig: function analyzeConfigAst(code,data) {
    let ast = esprima.parse(code, {range: true, tokens: true, comment: true});
    ast = escodegen.attachComments(ast, ast.comments, ast.tokens);

    let matches = esquery(ast, 'ObjectExpression > [key.name="toolkitConfig"]');
    let themeAST = {
      "type": "Property",
      "key": {
        "type": "Identifier",
        "name": "theme"
      },
      "value": {
        "type": "Literal",
        "value": data.theme
      },
      "kind": "init",
      "leadingComments" : [ { type: 'Line', value: ' 配置平台主题' } ]
    };

    //如果已经存在theme的话,则替换值
    if(matches.length && matches[0].value.type === 'ObjectExpression'){
      //判断是否有spma 这个属性
      let spmMatches = esquery(matches[0],'[key.name="theme"]');

      if(spmMatches.length){
        //如果相等,则直接退出
        if(spmMatches[0].value.value === data.theme){
          return;
        }else {
          spmMatches[0].value.value = data.theme;
        }
      }else {

        
        //toolkitConfig里面没有theme这个值,则加入
        matches[0].value.properties.push(themeAST);
      }
    }else {
      //不存在toolkitConfig的情况
      let objMatches = esquery(ast,'Program > ExpressionStatement > AssignmentExpression > ObjectExpression');

      if(objMatches.length){
        objMatches[0].properties.push({
          "type": "Property",
          "key": {
            "type": "Literal",
            "value": "toolkitConfig"
          },
          "value": {
            "type": "ObjectExpression",
            "properties": [
              themeAST
            ]
          },
          "kind": "init"
        })
      }
    }
    //最后返回源码
    return escodegen.generate(ast,{comment : true});
  },

  /**
   * 将retcode项目写入fie.config.js
   */
  writeFieConfig: function writeFieConfig(cwd, data) {
    var file = path.join(cwd, 'fie.config.js');
    //如果当前项目下没有fie.config.js 则不写入
    if (!fs.existsSync(file)) {
      return;
    }
    //读取文件
    let code = fs.readFileSync(file, 'utf8');
    let source = utils.analyzeFieConfig(code,data);
    if(!source) return;
    debug('writeFieConfig',source);
    fs.writeFileSync(file,source)
  }

};

module.exports = utils;
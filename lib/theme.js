'use strict';

var fieInstance;
var toolUtil = require('./util');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var chalk = require('chalk');
var cwd = toolUtil.getCwd();
var inquirer = require('inquirer');
var spawn = require('cross-spawn');
let debug = require('debug')('fie-toolkit-next');
let globby = require('globby');

module.exports = function(fie, options) {
  var clientArgs = options.clientArgs;
  var type = clientArgs[0];
  fieInstance = fie;

  if(type === 'install'){
    var name = clientArgs[1];
    installTheme(name);
  }else if(type === 'list' || type === undefined){
    listThemes();
  }else {
    fie.logError('theme 操作错误！');

    var help = `
  fie-toolkit-next 套件 theme 命令使用帮助:

    $ fie theme list                          # 显示本地主题列表
    $ fie theme install [name]                # 安装主题

    `;
    console.log(chalk.green(help));
  }

  options.callback && options.callback();

};

function installTheme(name){
  if(!name){
    fieInstance.logError('请输入要安装的主题名称，可以在fusion主题市场查找主题。');
    return;
  }

  fieInstance.tnpmInstall({name: name, save: true}, function(data){
     if(data === 1){
       console.log(chalk.red("tnpm 安装失败！"));
       return;
     }
     //写入package
     toolUtil.writeFieConfig(cwd,{theme : name});
     spawn.sync('node', ['build.js']);
     fieInstance.logSuccess(`${name} 主题已成功安装`)
  });
}
function listThemes(){
  var paths = globby.sync([
    'node_modules/@alife/dpl-*/'
  ]);
  var themesArr = [];
  paths.forEach( item =>{
    var theme = item.match(/(@alife\/dpl-[^/]*)\//)[1];
    debug('theme =>' + theme);
    themesArr.push(theme);
  } );
  var preStr = '本地已安装的主题包：'
  if(themesArr.length === 0 ){
    preStr = '本地暂未安装主题包。'
  }
  var listStr = `${preStr}
  ${themesArr.join('\n  ')}

您可以去fusion主题市场选择主题包安装：http://fusion-design.alibaba-inc.com/theme/market

fie-toolkit-next 套件 theme 命令使用帮助:

    $ fie theme list                          # 显示本地主题列表
    $ fie theme install [name]                # 安装主题
  `
  console.log(chalk.green(listStr));
}

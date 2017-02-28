/**
 */
'use strict';

var toolUtil = require('./util');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');
var inquirer = require('inquirer');
var chalk = require('chalk');
const fieApi = require('fie-api');

module.exports = function* (fie) {

  var cwd = toolUtil.getCwd();
  var projectName = cwd.split(path.sep).pop();
  //当前项目名称集合
  var generateNames = toolUtil.generateNames(projectName);
  var config = fie.getModuleConfig();
 
 //todo 通过数据接口增加qnui脚手架使用统计

  //执行命令 后面 带上 --debug  才能看到的调试信息
  //如 执行 fie init olympics --debug

  //copy root 目录到 项目中
  fie.dirCopy({
    src: toolUtil.getTemplateDir('root'),
    dist: cwd,
    data: _.extend({}, config, generateNames, {
      //兼容一下老版本
      projectName: projectName
    }),
    ignore: [
      'node_modules', 'build', '.DS_Store', '.idea'
    ],
    sstrRpelace: [
      {
        str: 'developing-project-name',
        replacer: projectName
      }
    ],
    filenameTransformer: function(name) {
      if (name === '_gitignore') {
        name = '.gitignore';
      }
      return name;
    }
  });

  //安装依赖
  // fie.logInfo('开始安装 dependencies 依赖包 ... ');

  //先装package里面的依赖
  yield fieApi.npm.installDependencies();

  console.log(chalk.yellow('\n--------------------初始化成功,请按下面提示进行操作--------------------\n'));
  console.log(chalk.green(chalk.yellow('$ fie start') + '               # 可一键开启项目开发环境'));
  console.log(chalk.green(chalk.yellow('$ fie build') + '               # 打包代码'));
  console.log(chalk.green(chalk.yellow('$ fie help') + '                # 可查看当前套件的详细帮助'));
  console.log(chalk.green('\n建议将现有初始化的代码提交一次到master分支, 方便后续切换到 ' + chalk.yellow('daily/x.y.z') + ' 分支进行开发'));
  console.log(chalk.yellow('\n--------------------技术支持:  @督布--------------------\n'));

};

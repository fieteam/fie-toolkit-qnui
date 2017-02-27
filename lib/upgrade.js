/**
 * Created by hugo on 16/7/28.
 */
var fieInstance;
var toolUtil = require('./util');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var cwd = toolUtil.getCwd();
var inquirer = require('inquirer');

module.exports = function(fie, options) {

  fieInstance = fie;

  addConfig(options);


};
/**
 * 覆盖配置文件
 */
function addConfig(options) {

  var tplPkg = require(path.join(toolUtil.getTemplateDir('root'), 'package.json')),
    cwdPkg = require(path.join(cwd, 'package.json')),
    allNames = toolUtil.generateNames(cwdPkg.name.replace('@alife/', '').replace('@ali/', ''));

  inquirer.prompt([
    {
      type: 'input',
      name: 'check',
      message: '执行该命令会覆盖当前项目下的 webpack.config.js fie.config.js build.js三个文件,建议先备份一下配置文件,再执行该操作!',
      default: function() {
        return 'yes';
      }
    }
  ]).then(function(answers) {
    //合并package.json 中的devDependencies
    if (tplPkg.devDependencies) {
      cwdPkg.devDependencies = _.extend(cwdPkg.devDependencies, tplPkg.devDependencies);
    }
    fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify(cwdPkg, null, 2), {encoding: 'utf8'});


    // 复制文件webpack 文件
    fieInstance.fileCopy({
      src: path.resolve(toolUtil.getTemplateDir('root'), 'webpack.config.js'),
      dist: path.resolve(cwd, 'webpack.config.js'),
      data: allNames
    });

    fieInstance.fileCopy({
      src: path.resolve(toolUtil.getTemplateDir('root'), 'build.js'),
      dist: path.resolve(cwd, 'build.js'),
      data: allNames
    });

    fieInstance.fileCopy({
      src: path.resolve(toolUtil.getTemplateDir('root'), 'fie.config.js'),
      dist: path.resolve(cwd, 'fie.config.js'),
      data: allNames
    });


    // 重新执行一下 tnpm ii
    fieInstance.tnpmInstall({}, function() {
      fieInstance.logSuccess('webpack.config.js fie.config.js build.js 替换完成!');
    });

    options.callback && options.callback();  

  });


}

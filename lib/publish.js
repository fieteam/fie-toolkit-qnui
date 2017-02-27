/**
 * @author 擎空 <zhenwu.czw@alibaba-inc.com>
 */
'use strict';

let path = require('path');
let fs = require('fs');
let spawn = require('cross-spawn');
let debug = require('debug')('fie-toolkit-next');
let inquirer = require('inquirer');
let co = require('co');
let toolUtil = require('./util');
let cwd = toolUtil.getCwd();
// let iceCollector = require('@ali/ice-collector');
let fieInstance;
/**
 * 获取当前分支
 * @returns {string}
 */
function getCurBranch() {
  var headerFile = path.join(cwd, '.git/HEAD');
  var gitVersion = fs.existsSync(headerFile) && fs.readFileSync(headerFile, {encoding: 'utf8'}) || '';
  var arr = gitVersion.split(/refs[\\\/]heads[\\\/]/g);
  var v = arr && arr[1] || '';
  return v.trim();
}

function onError(err) {
  console.log('[Error]');
  fieInstance.logError(err.stack || err.toString());
  process.exit(1);
}


/**
 * 更新描述信息到ICE里
 */
function *updateDescToIce(){
  try{
    let file = path.join(cwd,'package.json');
    let pkg = require(file);
    let name = pkg.name;
    let desc = pkg.description;

    debug(`package name is ${name} , desc is ${desc}`)
    if(name === desc || !desc){

      let data = yield inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: '请填写项目名称',
          validate: function (value) {
            if(!value){
              return '项目名称必须填写,仅需填写一次.';
            }else if(value === name){
              return '项目名称不能与 package.json 中的name字段相同';
            }
            return true;
          }
        }
      ]);

      pkg.description = data.description;
      debug(`input description is ${data.description}`)
      //写入package
      fs.writeFileSync(file,JSON.stringify(pkg,null,2));

      //更新描述
      // iceCollector.upload({
      //   description : data.description,
      //   rootDir : cwd,
      //   basicPackage : '@alife/qnui',
      //   kit : 'fie'
      // });

    }

  }catch (e){
    console.log('@ali/ice-collector 包发生错误,请联系 @宇果  @大果')
    throw e;
  }
}

module.exports = function(fie, options,next) {

  co(function*(){

    var clientArgs = options.clientArgs;
    var type = clientArgs.shift() || 'd';
    var branch = getCurBranch();

    if (branch === 'master') {
      fie.logWarn('不建议在master分支上进行开发及发布,建议切换到 daily/x.y.z 分支进行开发');
    }

    debug('branch',branch);

    yield updateDescToIce();

    // 发布到daily环境
    if (type === 'd' || type === 'daily') {

      fie.logInfo('开始提交到daily环境,大概需要几秒的时间,请稍等...');

      fie.getFieModule('fie-plugin-git', function(err, git) {
        git(fie, {
          clientArgs: ['publishDaily'],
          callback: function() {
            fie.logSuccess('发布成功,所有操作完成!');
            options.callback && options.callback();
            next && next()
          }
        });
      });
      return;
    }

    fie.logInfo('开始进行项目发布,大概需要几十秒的时间,请稍等...');
    fie.getFieModule('fie-plugin-git', function(err, git) {
      git(fie, {
        clientArgs: ['sync'],
        callback: function() {
          // 发布前同步一下版本号
          git(fie, {
            clientArgs: ['publishCDN'],
            callback: function() {
              fie.logSuccess('发布成功,所有操作完成!');
              options.callback && options.callback();
              next && next()
            }
          });
        }
      });
    });

  }).catch(onError)


};

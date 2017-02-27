'use strict';


var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');
var debug = require('debug')('fie-toolkit-next');
var argv = require('yargs').argv;


module.exports = function(fie, options) {

  var cli;

  var clientArgs = options.clientArgs;

  if (clientArgs && clientArgs.length) {
    process.env.SINGLE_PAGE = clientArgs[0];
  }

  if (!fs.existsSync(path.resolve(process.cwd(), 'webpack.config.js'))) {
    fie.logError('未发现 webpack.config.js 文件, 可以使用 fie add conf 添加对应版本 webpack 配置文件');
    return;
  }

  fie.logInfo('项目打包中...');
  //将所有参数收集起来,方便执行spawn
  var spawnArr = [
    './node_modules/.bin/webpack',
    '--config',
    './webpack.config.js'
  ];

  //merge 控制台的输入
  for(let k in argv){
    if (!(k === '_' || k === '$0')) {
      let join = k.length === 1 ? '-' : '--';
      //判断是不是端口,是端口的话,做一下是否被占用的处理
      spawnArr.push(join + k);
      spawnArr.push(argv[k]);
    }
  }


  debug('build argv',spawnArr);
  //判断是不是云构建,如果是的话,遇到错误强制抛出异常
  if(process.env.BUILD_ENV === 'cloud'){
    spawnArr.push('--bail')
  }

  cli = spawn(spawnArr[0], spawnArr.slice(1), {stdio: 'inherit'});

  cli.on('close', function(status) {

    if (status == 0) {
      fie.logSuccess('打包完成');
      options.callback && options.callback();
    } else {
      fie.logError('打包失败', status);
    }
  });


  try{
    // let iceCollector = require('@ali/ice-collector');
    // iceCollector.upload({
    //   rootDir : process.cwd(),
    //   basicPackage : '@alife/next',
    //   kit : 'fie'
    // });

  }catch (e){
    console.log('@ali/ice-collector 包发生错误,请联系 @宇果  @大果')
  }
};

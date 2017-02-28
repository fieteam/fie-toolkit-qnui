/**
 * 打开服务器
 */
'use strict';
var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');
var FallbackPort = require('fallback-port');
var open = require('open');
var argv = require('yargs').argv;
var cwd = process.cwd();
const fieApi = require('fie-api');

/**
 *
 * @param fie
 * @param fie.getModuleConfig
 * @param fie.logError
 */
module.exports = function(fie, options) {

  if (!fs.existsSync(path.resolve(cwd, 'webpack.config.js'))) {
    fie.logError(
        '未发现 webpack.config.js 文件, 可以使用 fie add conf 添加对应版本 webpack 配置文件'
    );
    return;
  }


  //判断是否有node_modules目录
  if( !fs.existsSync(path.resolve(cwd,'node_modules'))){
    fie.logInfo('检测到当前项目中没有 node_modules 目录,开始自动安装相关依赖...');
    fieApi.npm.installDependencies(function() {
      init()
    });
  }else {
    init();
  }


  function init(){
    var clientArgs = options.clientArgs,
        toolkitConfig = fie.getModuleConfig(),
        configPort = toolkitConfig.p || toolkitConfig.port,
        fallbackPort = new FallbackPort(configPort),
        port = fallbackPort.getPort();

    if(clientArgs && clientArgs.length) {
      process.env.SINGLE_PAGE = clientArgs[0];
    }



    process.env.DEV = 1;
    process.env.LIVELOAD = toolkitConfig.liveload ? 1 : 0;

    //查看端口是否占用
    if(port !== configPort){
      fie.logWarn(`${configPort} 端口已被占用, fie 为你开启另外一个端口: ${port}, 防止冲突!`)
    }

    //将所有参数收集起来,方便执行spawn
    var spawnArr = ['sudo',
      './node_modules/.bin/webpack-dev-server',
      '--config',
      './webpack.config.js',
      '--host',
      '0.0.0.0',
      '--port',
      port
    ];

    //merge 控制台的输入
    for(let k in argv){
      //排除掉无用参数及端口参数
      if (!(k === '_' || k === '$0' || k === 'p' || k === 'port')) {
        let join = k.length === 1 ? '-' : '--';
        spawnArr.push(join + k);
        spawnArr.push(argv[k]);
      }
    }

    //80端口需要sudo开启
    if(port == 80){
      spawn(spawnArr[0],spawnArr.slice(1), {stdio: 'inherit'});
    }else {
      spawn(spawnArr[1],spawnArr.slice(2), {stdio: 'inherit'});
    }

    if (toolkitConfig.open) {
      // 开服务器比较慢,给它留点时间buffer
      setTimeout(function() {
        open('http://127.0.0.1:' + port + '/' + toolkitConfig.openTarget);
      }, 2000);
    }
    options.callback && options.callback();
  }

};

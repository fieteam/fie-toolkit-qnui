'use strict';

var fieInstance;
var toolUtil = require('./util');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var chalk = require('chalk');
var cwd = toolUtil.getCwd();
var inquirer = require('inquirer');

module.exports = function(fie, options) {
  
  var clientArgs = options.clientArgs;
  var type = clientArgs.type;
  var name = clientArgs.name;
  var pageTypeMap = {
    sp: 'simple-page',
    lp: 'layout-page',
    rp: 'redux-page',
    rd: 'redux-only'
  };

  fieInstance = fie;

  if (type === 'data' || type === 'd') {

    addData(name);
  } else if (Object.keys(pageTypeMap).indexOf(type) !== -1) {

    addTopPage(name, pageTypeMap[type]);
  } else if (type === 'rrp') {

    addReduxRouterPage(name);
  } else if (type === 'c' || type === 'component') {

    addComponent(name);

  } else {

    fie.logError('需要添加的类型错误');

    var help = `
  fie-toolkit-next 套件 add 命令使用帮助:

    $ fie add sp [name]                       # 添加简单页面
    $ fie add lp [name]                       # 添加带 layout 的简单页面
    $ fie add rd [name]                       # 添加带 layout 及 redux 的简单页面
    $ fie add rp [name]                       # 添加带 layout 及 redux、router 的复杂页面
    $ fie add rrp [topPageName]/[subPageName] # 添加带复杂页面的子页面
    $ fie add data [name]                     # 添加本地数据接口
    $ fie add c [name]                        # 添加组件

`;

    console.log(chalk.green(help));
  }

  options.callback && options.callback();  

};


function addComponent(name) {

  var allNames;

  if (!name) {
    fieInstance.logError('请输入要添加的组件名,多个单词,请使用横杠连接');
    return;
  }

  allNames = toolUtil.generateNames(name);
  if (fs.existsSync(path.resolve(toolUtil.getCwd(), 'src/components', allNames.fileName))) {
    fieInstance.logError('该组件已存在，创建失败');
    return;
  }

  fieInstance.logInfo('正在添加文件...');
  fieInstance.dirCopy({
    src: toolUtil.getTemplateDir('component'),
    dist: path.resolve(toolUtil.getCwd(), 'src/components', allNames.fileName),
    sstrReplace: [{
      str: 'developingClassName',
      replacer: allNames.className
    }, {
      str: 'develpingFileName',
      replacer: allNames.fileName
    }]
  });
  fieInstance.logSuccess('添加完成。');
}


function addReduxRouterPage(name) {

  var topNames;
  var subNames;
  var sstrReplaceData;
  var routerFile;
  var reducerFile;
  var routerContent;
  var reducerContent;

  if (!name) {
    fieInstance.logError('请输入要添加的页面名,多个单词,请使用横杠连接');
    return;
  }

  name = name.split('/');

  if (name.length !== 2) {

    fieInstance.logError('需要 redux 路由页面名错误，请以 top-page/sub-page 的形式输入');
    return;
  }

  topNames = toolUtil.generateNames(name[0]);
  subNames = toolUtil.generateNames(name[1]);

  if (!fs.existsSync(path.resolve(cwd, 'src/pages', topNames.fileName))) {
    fieInstance.logError('顶层页面' + topNames.fileName + ' 页面不存在');
    return;
  }


  if (!fs.existsSync(path.resolve(cwd, 'src/pages', topNames.fileName, 'containers'))) {
    fieInstance.logError('顶层页面' + topNames.fileName + ' 不是 redux 类型页面');
    return;
  }

  if (fs.existsSync(path.resolve(cwd, 'src/pages', subNames.fileName, 'containers', subNames.fileName))) {
    fieInstance.logError(name + ' 页面已存在，创建失败');
    return;
  }


  fieInstance.logInfo('正在添加文件...');

  //由于直接在 class 声明处,书写  underscore 变量名符号编辑器会报名,用一些特殊的字符串代理
  sstrReplaceData = [{
    str: 'developingClassName',
    replacer: subNames.className
  }, {
    str: 'develpingFileName',
    replacer: subNames.fileName
  }, {
    str: 'develpingVarName',
    replacer: subNames.varName
  }];


  //添加 container 文件
  fieInstance.dirCopy({
    src: toolUtil.getTemplateDir('redux-router-page/container'),
    dist: path.resolve(cwd, 'src/pages', topNames.fileName, 'containers', subNames.fileName),
    sstrReplace: sstrReplaceData
  });

  //添加 reducer 文件
  fieInstance.dirCopy({
    src: toolUtil.getTemplateDir('redux-router-page/reducer'),
    dist: path.resolve(cwd, 'src/pages', topNames.fileName, 'reducers', subNames.fileName),
    sstrReplace: sstrReplaceData
  });

  //添加 action 文件
  fieInstance.fileCopy({
    src: path.resolve(toolUtil.getTemplateDir('redux-router-page/action'), 'index.js'),
    dist: path.resolve(cwd, 'src/pages', topNames.fileName, 'actions', subNames.fileName + '.js'),
    data: subNames
  });


  //注入 routes 信息
  routerFile = path.resolve(cwd, 'src/pages', topNames.fileName, 'routes.js');
  routerContent = fs.readFileSync(routerFile).toString();
  routerContent = fieInstance.fileRewrite({
    content: routerContent,
    hook: '<IndexRoute',
    place: 'before',
    insertLines: [
      '  <Route path=\'' + subNames.fileName + '\' component={' + subNames.className + '} title=\'' + subNames.fileName + '\' />'
    ]
  });
  routerContent = fieInstance.fileRewrite({
    content: routerContent,
    hook: 'react-router',
    place: 'after',
    insertLines: [
      'import ' + subNames.className + ' from \'./containers/' + subNames.fileName + '/index\';'
    ]
  });
  fs.writeFileSync(routerFile, routerContent);
  fieInstance.logSuccess(routerFile + ' 文件注入成功');

  //注入 reducer 信息
  reducerFile = path.resolve(cwd, 'src/pages', topNames.fileName, 'reducers/index.js');
  reducerContent = fs.readFileSync(reducerFile).toString();
  reducerContent = fieInstance.fileRewrite({
    content: reducerContent,
    hook: 'react-router-redux',
    insertLines: [
      'import ' + subNames.varName + ' from \'./' + subNames.fileName + '/\';'
    ]
  });
  reducerContent = fieInstance.fileRewrite({
    content: reducerContent,
    hook: 'routing',
    place: 'before',
    insertLines: [
      '  ' + subNames.varName + ','
    ]
  });
  fs.writeFileSync(reducerFile, reducerContent);
  fieInstance.logSuccess(reducerFile + ' 文件注入成功');

  addSuccess();
  //fieInstance.logSuccess('添加完成。');
}

/**
 * 添加简单页面
 * @param {[type]} name [description]
 */
function addTopPage(name, type) {

  //正则来源https://github.com/parshap/node-sanitize-filename
  var reg = /[\/\?<>\\:\*\|":]/g;
  var config = fieInstance.getModuleConfig();
  var allNames;
  var sstrReplaceData;
  var cwd = toolUtil.getCwd();

  if (!name) {
    fieInstance.logError('请输入要添加的页面名,多个单词,请使用横杠连接');
    return;
  }

  if (reg.test(name)) {
    fieInstance.logError('页面名称不能带有特殊字符 (/, ?, <, >, \, :, *, |, and ")');
    return;
  }

  allNames = _.extend({},config,toolUtil.generateNames(name),{type : type});
  

  if (fs.existsSync(path.resolve(cwd, 'src/pages', allNames.fileName))) {
    fieInstance.logError(name + ' 页面已存在，创建失败');
    return;
  }


  fieInstance.logInfo('正在添加文件...');
  // 由于直接在 class 声明处,书写  underscore 变量名符号编辑器会报名,用一些特殊的字符串代理
  sstrReplaceData = [{
    str: 'developingClassName',
    replacer: allNames.className
  }, {
    str: 'develpingFileName',
    replacer: allNames.fileName
  }];

  // 添加 less 和 js 文件
  fieInstance.dirCopy({
    src: toolUtil.getTemplateDir(type),
    dist: path.resolve(cwd, 'src/pages', allNames.fileName),
    sstrReplace: sstrReplaceData,
    data: allNames
  });

  // 添加 html 文件
  fieInstance.fileCopy({
    src: path.resolve(toolUtil.getTemplateDir('html'), 'index.html'),
    dist: path.resolve(toolUtil.getCwd(), 'demos', allNames.fileName + '.html'),
    data: allNames
  });

  addSuccess();
  //fieInstance.logSuccess('添加完成。');
  //fieInstance.logWarn('注意:新页面需要重启 fie start 才能生效');

}

/**
 * 添加mock数据
 * 在 data目录下添加一个 xxx.json文件 , 在 apimap.js里面注入一个请求信息
 */
function addData(name) {

  var allNames;
  var apiMapFile;
  var apiMapContent;

  if (!name) {
    fieInstance.logError('请输入要添加的数据名,多个单词,请使用横杠连接');
    return;
  }

  allNames = toolUtil.generateNames(name);
  if (fs.existsSync(path.resolve(toolUtil.getCwd(), 'data', allNames.fileName + '.json'))) {
    fieInstance.logError('该数据已存在，创建失败');
    return;
  }

  //复制文件
  fieInstance.fileCopy({
    src: path.resolve(toolUtil.getTemplateDir('data'), 'index.json'),
    dist: path.resolve(toolUtil.getCwd(), 'data', allNames.fileName + '.json')
  });

  //注入apiMap
  apiMapFile = path.resolve(toolUtil.getCwd(), 'src/utils/apimap.js');
  if (fs.existsSync(apiMapFile)) {

    apiMapContent = fieInstance.fileRewrite({
      content: fs.readFileSync(apiMapFile).toString(),
      hook: '/*invoke*/',
      insertLines: [
        '  ' + allNames.varName + ': \'/data/' + allNames.fileName + '.json\','
      ]
    });
    fs.writeFileSync(apiMapFile, apiMapContent);
    fieInstance.logSuccess(apiMapFile + ' 文件注入成功');
  }
}

function addSuccess(){
  var config = fieInstance.getModuleConfig('retcode');

  console.log(chalk.yellow('\n--------------------页面添加成功,请按下面提示进行操作--------------------\n'));
  console.log(chalk.green( chalk.yellow('$ fie start') +'               # 新加页面后,需要重启服务才能访问' ));
  if (!(config && config.projectId)) {
    console.log(chalk.green(chalk.yellow('$ fie retcode create -p') + '   # 将项目接入retcode监控平台'));
  }
  console.log(chalk.green( chalk.yellow('$ fie retcode create') +'      # 创建页面对应的retcode任务' ));
  console.log(chalk.green( chalk.yellow('$ fie spmb create') +'         # 创建页面对应的spm B位' ));
  console.log(chalk.yellow('\n--------------------技术支持: @擎空 @潕量 @宇果--------------------\n'));
}


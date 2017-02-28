/**
 * 套件帮助文档 可查看: http://gitlab.alibaba-inc.com/fie/fie-toolkit-qnui
 */
module.exports = {
  // 当前项目使用的fie套件
  toolkit: 'fie-toolkit-qnui',

  toolkitConfig: {
    // 本地服务器端口号
    port: 9000,
    // 是否自动打开浏览器
    open: true,
    // 打开浏览器后 自动打开的 目标页面
    openTarget: 'demos/index.html',
    // 文件修改后是否自动刷新浏览器
    liveload: true
  },

  tasks: {
    start: [
      {
        // 执行build目录的copy
        command: 'node build.js'
      }
    ],
    build: [
      {
        // 同步类库到build/lib目录
        command: 'node build.js'
      }
    ],
    publish: []
  }
};


var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DEV = process.env.DEV;
var LIVELOAD = process.env.LIVELOAD;
var SINGLE_PAGE = process.env.SINGLE_PAGE;
var webpack = require('webpack');
var path = require('path');
var globby = require('globby');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var cwd = process.cwd();
var isWin = /^win/.test(process.platform);
var qnuiReg = isWin ? new RegExp(/node_modules\\.*qnui.*/) : new RegExp(/node_modules\/.*qnui.*/);

var files = globby.sync(['**/pages/*'], { cwd: cwd + '/src' });
var entry = {
  // vendor: []
};
files.forEach((item) => {
  entry[item + '/index'] = ['./src/' + item + '/index.js'];
});


var config = {
  context: cwd,
  entry,
  output: {
    path: 'build',
    publicPath: 'build',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      components: path.join(__dirname, 'src/components'),
      utils: path.join(__dirname, 'src/utils'),
      styles: path.join(__dirname, 'src/styles'),
      pages: path.join(__dirname, 'src/pages')
    }
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.scss/,
        include: [
          path.resolve(__dirname,"src"),
          qnuiReg
        ],
        loader: ExtractTextPlugin.extract('style', 'raw!postcss!sass-loader')
      }
    ]
  },
  postcss: () => [precss, autoprefixer],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-redux': 'ReactRedux',
    'react-router': 'ReactRouter',
    'react-router-redux': 'ReactRouterRedux',
    'redux-thunk': 'var window.ReduxThunk.default',
    'redux': 'Redux',
    'qnui': 'qnui',
    'react/lib/ReactTransitionGroup': 'var window.React.addons.TransitionGroup',
    'react/lib/ReactCSSTransitionGroup': 'var window.React.addons.CSSTransitionGroup'
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css', {
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
    }),
    // 允许错误不打断程序
    new webpack.NoErrorsPlugin(),

    // 进度插件
    new webpack.ProgressPlugin((percentage, msg) => {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`📦   ${msg}`);
        stream.clearLine(1);
      }
    }),
    // 环境变量定义
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(DEV ? 'development' : 'production')
      },
      __DEV__: JSON.stringify(JSON.parse(DEV ? 'true' : 'false'))
    })
  ]
};


if (LIVELOAD && LIVELOAD != 0) {
  // config.entry.vendor.push('webpack-dev-server/client?/');
}

// 发布状态
if (!DEV) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      },
      mangle: {
        except: ['$', 'exports', 'require']
      },
      output: {
        ascii_only: true
      }
    }
    ),
    // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块。
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  );
} else {
  config.devServer = {
    headers: { 'Access-Control-Allow-Origin': '*' },
    'Access-Control-Allow-Credentials': 'true'
  };
  config.plugins.push(new webpack.SourceMapDevToolPlugin({}));
}

// 如果需要单个的start或者build
if (SINGLE_PAGE) {
  const key = 'pages/' + SINGLE_PAGE + '/index';
  config.entry = {};
  config.entry[key] = ['./src/pages/' + SINGLE_PAGE + '/index.js'];
}

module.exports = config;

const path = require('path');
const opn = require('opn');
const port = 10086;
process.env.VUE_APP_ENV === 'development' ? setTimeout(() => opn(`http://localhost:${port}`), 0) : void 0;
const resolve = dir => {
  return path.join(__dirname, dir);
};
module.exports = {

  outputDir: 'dist',
  publicPath: process.env.VUE_APP_ENV === 'development' ? '/' : '/',
  assetsDir: 'public',
  lintOnSave: process.env.VUE_APP_ENV === 'development',

  filenameHashing: true,
  // All options for webpack-dev-server are supported
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    open: false,
    port,
    https: false,
    hotOnly: false,
    // disableHostCheck: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:6166', // 开发环境
        // target: 'http://4qykha.natappfree.cc',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: [process.env.VUE_APP_BASE_API]
        } // 路径重定向
      }
    }
  },
  // When building in multi-pages mode, the webpack config will contain different plugins
  // (there will be multiple instances of html-webpack-plugin and preload-webpack-plugin).
  // Make sure to run vue inspect if you are trying to modify the options for those plugins.
  pages: {
    index: {
      // entry for the pages
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: '小型企业进销存管理系统',
      // chunks to include on this pages, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: ''
  },
  css: {
    loaderOptions: {
      // 但是在配置 `additionalData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        additionalData: `@import "@/styles/index.scss";`
      }
    }
  },
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: false,

  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],

  // 生产环境 sourceMap
  productionSourceMap: false,

  // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
  // corsUseCredentials: false,
  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // https://cli.vuejs.org/guide/webpack.html#simple-configuration
  configureWebpack: {
    // 编译时警告 entrypoint size limit
    performance: {
      hints: false,
      maxEntrypointSize: 2048000,
      maxAssetSize: 2048000
    }
  },

  // webpack 链接 API，用于生成和修改 webapck 配置
  // https://github.com/mozilla-neutrino/webpack-chain
  chainWebpack: (config) => {
    // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
    config.optimization
      .splitChunks({
        cacheGroups: {}
      });
    // const types = ["vue-modules", "vue", "normal-modules", "normal"];
    // types.forEach((type) =>
    //   addStyleResource(config.module.rule("less").oneOf(type))
    // );
    // function addStyleResource(rule) {
    //    rule
    //      .use("style-resource")
    //      .loader("style-resources-loader")
    //      .options({
    //        patterns: [path.resolve(__dirname, "./src/styles/anHui-new/common.less")],
    //      });
    //  }
    // 'node_modules' 目录下为外部库文件，不参与 eslint 检测

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/SVG'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/SVG'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    config.module
      .rule('eslint')
      .exclude
      .add('/node_modules')
      .end();
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,

  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // 第三方插件配置
  pluginOptions: {}
};

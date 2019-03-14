const helpers = require("./helpers")
const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin")
const DiskPlugin = require("webpack-disk-plugin")
const prettyFormat = require("pretty-format")

const ENVAPPSRVPORT = require("./env/ENVAPPSRVPORT")

/**
 * @type {import("webpack-dev-server").Configuration}
 */
const devServer = {
  clientLogLevel: "warning",
  host: "localhost",
  hot: true,
  port: parseInt(ENVAPPSRVPORT.getVDev()),
  stats: "errors-only", // normal
  watchContentBase: false,
}

const webpack_aliase = {
  "@components": helpers.rootAbs("src/js/components/"),
  "@css": helpers.rootAbs("src/assets/css/"),
  "@font": helpers.rootAbs("src/assets/fonts/"),
  "@home": helpers.rootAbs(),
  "@html": helpers.rootAbs("src/html/"),
  "@icon": helpers.rootAbs("src/assets/icons/"),
  "@img": helpers.rootAbs("src/assets/img/"),
  "@js": helpers.rootAbs("src/js/"),
  "@svg": helpers.rootAbs("src/assets/svg/"),
}

/**
 * @type {import("webpack").Rule[]}
 */
const rules = [
  {
    test: /\.html$/,
    exclude: [/src\/template.html/],
    use: {
      loader: "vue-template-loader",
      options: {
        hmr: true,
        transformAssetUrls: {
          video: ["src", "poster"],
          source: "src",
          img: "src",
          image: "xlink:href",
          object: "data",
          use: ["href", "xlink:href"],
        },
      },
    },
  },
  {
    test: /\.(png|jpe?g|gif|svg)(#.*)?(\?.*)?$/,
    use: [
      {
        loader: "file-loader",
        options: {
          limit: 10000,
          emitFile: true,
          name: "[name].[ext]",
          useRelativePath: true,
        },
      },
    ],
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: "url-loader",
    options: {
      limit: 10000,
      emitFile: true,
      name: "[name].[ext]",
      useRelativePath: true,
    },
  },
]

/**
 * @type {import("webpack").Loader[]}
 */
const cssLoader = [
  {
    loader: "css-loader",
    options: {
      importLoaders: 1,
    },
  },
  "postcss-loader",
]

/**
 * @type {import("webpack").Node}
 */
const node = {
  // prevent webpack from injecting useless setImmediate polyfill because Vue
  // source contains it (although only uses it if it's native).
  setImmediate: false,
  // prevent webpack from injecting mocks to Node native modules
  // that does not make sense for the client
  dgram: "empty",
  fs: "empty",
  net: "empty",
  tls: "empty",
  child_process: "empty",
}

/**
 * @type {import ("webpack").Configuration[]}
 */
const webpackConfig = [
  {
    devServer,
    entry: {
      app: "./src/js/index",
    },
    output: {
      filename: "[name].js",
      path: helpers.rootAbs("dist"),
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        ...webpack_aliase,
      },
    },
    // devtool: "source-map",
    module: {
      rules: rules.concat({
        test: /\.css$/,
        use: /** @type {import("webpack").Loader[]} */ ([
          {
            loader: "style-loader",
          },
        ]).concat(cssLoader),
      }),
    },
    node,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: function(module) {
          return module.context && module.context.indexOf("node_modules") !== -1
        },
      }),
      new HtmlWebpackPlugin({
        template: "src/template.html",
        title: "Template",
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HardSourceWebpackPlugin({
        // Clean up large, old caches automatically.
        cachePrune: {
          // Caches younger than `maxAge` are not considered for deletion. They must
          // be at least this (default: 2 days) old in milliseconds.
          maxAge: 1 * 24 * 60 * 60 * 1000,
          // All caches together must be larger than `sizeThreshold` before any
          // caches will be deleted. Together they must be at least this
          // (default: 10 MB) big in bytes.
          sizeThreshold: 10 * 1024 * 1024,
        },
        configHash: function() {
          return process.env.NODE_ENV
        },
        info: {
          // 'debug', 'log', 'info', 'warn', or 'error'.
          level: "debug",
          // 'none' or 'test'.
          mode: "none",
        },
      }),
    ],
  },
  {
    entry: "./src/js/dummy",
    output: {
      filename: "dummy.js",
      path: helpers.rootAbs("build"),
    },
    resolve: {
      alias: {
        ...webpack_aliase,
      },
    },
    module: {
      rules: rules.concat({
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ use: cssLoader }),
      }),
    },
    node,
    plugins: [
      new webpack.NamedModulesPlugin(),
      new ExtractTextPlugin("styles.css"),
      // Write out asset files to disk.
      // @ts-ignore
      new DiskPlugin({
        output: {
          path: helpers.rootAbs("build"),
        },
        files: [
          {
            asset: /\.css$/,
            output: {
              filename: "styles.css",
            },
          },
        ],
      }),
    ],
  },
]

const output = prettyFormat(webpackConfig, { highlight: true })

console.log(output)

module.exports = webpackConfig

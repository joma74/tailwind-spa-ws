const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
var DiskPlugin = require("webpack-disk-plugin")
const prettyFormat = require("pretty-format")

/**
 * @type {import("webpack-dev-server").Configuration}
 */
const devServer = {
  port: 8080,
  watchContentBase: false,
  hot: true,
  stats: "errors-only",
  host: "0.0.0.0",
}

const webpack_aliase = {
  "@components": path.resolve(__dirname, "src/js/components/"),
  "@css": path.resolve(__dirname, "src/assets/css/"),
  "@font": path.resolve(__dirname, "src/assets/fonts/"),
  "@home": path.resolve(__dirname),
  "@html": path.resolve(__dirname, "src/html/"),
  "@img": path.resolve(__dirname, "src/assets/img/"),
  "@js": path.resolve(__dirname, "src/js/"),
  "@svg": path.resolve(__dirname, "src/assets/svg/"),
}

/**
 * @type {import ("webpack").Configuration[]}
 */
var webpackConfig = [
  {
    entry: "./src/js/index",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
    },
    devServer,
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        ...webpack_aliase,
      },
    },
    // devtool: "source-map",
    module: {
      rules: [
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
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
              },
            },
            "postcss-loader",
          ],
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
      ],
    },
    node: {
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
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/template.html",
        title: "Template",
      }),
      new webpack.NamedModulesPlugin(),
    ],
  },
  {
    entry: "./src/js/dummy",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "dummy.js",
    },
    resolve: {
      alias: {
        ...webpack_aliase,
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                },
              },
              "postcss-loader",
            ],
          }),
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
      ],
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new ExtractTextPlugin("styles.css"),
      // Write out asset files to disk.
      new DiskPlugin({
        output: {
          path: path.resolve(__dirname, "build"),
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

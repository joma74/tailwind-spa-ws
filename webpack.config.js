const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const prettyjson = require("prettyjson");

/**
 * @type {import ("webpack"}.Configuration}
 */
var webpackConfig = {
  entry: "./src/js/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    port: 8080,
    watchContentBase: false,
    hot: true,
    stats: "errors-only"
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@js": path.resolve(__dirname, "src/js/"),
      "@css": path.resolve(__dirname, "src/assets/css/"),
      "@home": path.resolve(__dirname),
      "@img": path.resolve(__dirname, "src/assets/img/"),
      "@svg": path.resolve(__dirname, "src/assets/svg/"),
      "@components": path.resolve(__dirname, "src/js/components/"),
      "@html": path.resolve(__dirname, "src/assets/html/")
    }
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
            transformToRequire: {
              video: ["src", "poster"],
              source: "src",
              img: "src",
              image: "xlink:href"
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 10000,
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "src/assets/fonts[name].[hash:7].[ext]"
        }
      }
    ]
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
    child_process: "empty"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/template.html",
      title: "Tailwind Starter Template"
    }),
    new webpack.NamedModulesPlugin(),
  ]
};

console.log(prettyjson.render(webpackConfig));

module.exports = webpackConfig;

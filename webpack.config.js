const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
module.exports = (env = 'development') => {
  if (env !== 'production') env = 'development';
  return {
    entry: './src/main.js',
    output: {
      filename: '[name]-[hash].js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool: 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader'
            },
          ]
        },
        {
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader!postcss-loader'
          })
        },
        {
          test: /\.(jpg|png|jpeg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new cleanWebpackPlugin(['dist']),
      new htmlWebpackPlugin({
        title: 'todo app',
        filename: 'index.html',
        templateContent: '<div id="root"></div>',
        favicon:path.resolve(__dirname, 'src/favicon.ico')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: Infinity,
        filename: '[name].js',
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        _: 'lodash'
      }),
      new ManifestPlugin(),
      new ExtractTextPlugin('style.css'),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(env)
        }
      }),
      new webpack.optimize.UglifyJsPlugin(env === 'production' ? {
        compress: true,
        beautify: false
      } : {
          compress: false,
          beautify: true
        }),
    ],
    resolve: {
      alias: {

      }
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      compress: true,
      inline: true,
      open: true,
      hot: true,
      port: 3002,
      historyApiFallback: true,
      proxy: {
        // "/api": {
        //   target: "http:localhost:3000",
        //   pathRewrite: {"^/api": ""}
        // }
      },
      setup(app) {
        // app is a express app instance, add ur middleware here
      }
    }
  };
}
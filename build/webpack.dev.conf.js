'use strict'

const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    host: config.dev.host || 'localhost',
    port: config.dev.port || '8000',
    open: config.dev.autoOpenBower,
    overlay: config.dev.overlay ? {
      warning: false,
      errors: true,
    } : false,
    publicPath: config.dev.publicPath || '/',
    proxy: config.dev.proxyTable,
    quiet: true,
    watchOptions: {
      poll: false,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'dependency',
    }),
  ],
})
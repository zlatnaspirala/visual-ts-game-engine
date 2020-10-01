
var { rootBuildPath, resolveExtensions, roles } = require("../webpack.global.vars");

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

/**
 * 2) WebPack for single player solution.
 *
 */

let appSingleplayerPlatform = "/singleplayer";

let internalConfig = {
  createDocumentation: false,
  stats: "errors-warnings"
};

module.exports = webPackModuleSingleSimpleSolution = {

  mode: "development",
  watch: true,
  stats: internalConfig.stats,
  entry: ["./src/app-platformer-single.ts"],
  output: {
    filename: "visualjs2.js",
    path: __dirname + "/../" + rootBuildPath + appSingleplayerPlatform,
  },

  devtool: "none",

  resolve: resolveExtensions,

  module: {
    rules: roles
  },

  plugins: [
    // Make sure that the plugin is after any plugins that add images
    new CleanWebpackPlugin(['build'], { /*exclude:  ['index.html']*/ }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/message-box.html',
      template: 'src/html-components/message-box.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new ExtractTextPlugin("src/style/styles.css"),
    new CopyWebpackPlugin([
      { from: './src/libs/addons/hacker-timer/hack-timer.js', to: 'externals/hack-timer.js'},
      { from: './src/libs/addons/drag/drag.ts', to: 'externals/drag.ts' },
      { from: './src/libs/addons/hacker-timer/hack-timer-worker.js', to: 'externals/hack-timer-worker.js' },
      { from: './src/manifest.web', to: 'manifest.web' },
      { from: './src/libs/addons/cache/cacheInit.ts', to: 'externals/cacheInit.ts' },
      { from: './src/libs/addons/cache/worker.js', to: 'worker.js' },
      { from: './src/libs/addons/cache/offline.html', to: 'offline.html' },
      { from: "./src/examples/platformer-single-player/ui/select-player.html", to: "templates/ui/select-player.html"},
      { from: "./src/examples/platformer-single-player/ui/player-board.html", to: "templates/ui/single-player-board.html"},
    ], { debug: 'warn' })
    // { debug: 'info' } make trace

  ],

};

/**
 * Documentation generator
 */
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

/**
 * @description
 * Import individual webpack packages or
 * Remove package from multi compile webpackconfig.
 */
var webPackModuleMultiPlayerSolution = require("./individual-webpack-packages/multiplayer-solution");
var webPackModuleSingleSimpleSolution = require("./individual-webpack-packages/single-player-solution");
var webPackModuleTutorialsDemo1 = require("./individual-webpack-packages/add-element");
var webPackModuleTutorialsDemo2 = require("./individual-webpack-packages/webcamera-stream-demo2");
var webPackModuleMultiChatBasketBall = require("./individual-webpack-packages/angry-chat");
var webPackModuleSpriteAnimationDemo = require("./individual-webpack-packages/sprite-animation");

let config = {
  module: {},
};

let internalConfig = {
  createDocumentation: false,
  // stats: "errors-warnings"
};

let documentationPlugin = new TypedocWebpackPlugin({
  out: './api-doc',
  module: 'amd',
  target: 'es5',
  exclude: ['**/node_modules/**/*.*', '**/level*.ts'],
  experimentalDecorators: true,
  excludeExternals: true,
  name: 'sn-theme',
  mode: 'file',
  theme: './sn-theme/',
  includeDeclarations: false,
  ignoreCompilerErrors: true,
});

 /**
  * WebPacks objects for tutorials comes from import
  * folder `./individual-webpack-packages`
  *
  * List:
  *  Output -> /demo1 - Add element
  *  Output -> /demo2 - Webcamera stream intro gameplay
  */

if (internalConfig.createDocumentation == true) {
  webPackModuleMultiPlayerSolution.plugins.push(documentationPlugin);
}

module.exports = [
  webPackModuleMultiPlayerSolution,
  webPackModuleSingleSimpleSolution,
  webPackModuleMultiChatBasketBall,
  webPackModuleTutorialsDemo1,
  webPackModuleTutorialsDemo2,
  webPackModuleSpriteAnimationDemo
];

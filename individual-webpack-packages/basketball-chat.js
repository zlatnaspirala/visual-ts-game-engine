
/**
 * @description
 * WebPacks individual pack
 * 1) WebPack for multiplayer solution
 */
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

var {rootBuildPath, resolveExtensions, roles} = require("../webpack.global.vars");

const appMultiBasketBallChatPlatform = "/basket-ball-chat";

let internalConfig = {
	createDocumentation: false,
	stats: "errors-warnings"
};

module.exports = webPackModuleMultiChatBasketBall = {

	mode: "development",
	watch: true,
	stats: internalConfig.stats,
	entry: ["./src/examples/basket-ball-chat/appBasketBallChat.ts"],
	output: {
		filename: "visualjs2.js",
		path: __dirname + "/../" + rootBuildPath + appMultiBasketBallChatPlatform,
	},

	devtool: "hidden-source-map",

	resolve: resolveExtensions,

	module: {
		rules: roles
	},

	plugins: [
		// Make sure that the plugin is after any plugins that add images
		// new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['build']}),
		new HtmlWebpackPlugin({
			filename: 'app.html',
			template: './src/index.html'
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'defer'
		}),
		new MiniCssExtractPlugin({
			linkType: "text/css",
		}),
		new CopyWebpackPlugin([
			{from: 'src/style/broadcaster2.css', to: 'styles/broadcaster2.css'},
			{from: './src/libs/class/networking2/openvidu-browser-2.20.0.js', to: 'openvidu-browser-2.20.0.js'},
			{from: './src/libs/addons/hacker-timer/hack-timer.js', to: 'externals/hack-timer.js'},
			{from: './src/libs/addons/drag/drag.ts', to: 'externals/drag.ts'},
			{from: './src/libs/addons/hacker-timer/hack-timer-worker.js', to: 'externals/hack-timer-worker.js'},
			{from: './src/manifest.web', to: 'manifest.web'},
			{from: './src/libs/addons/cache/cacheInit.ts', to: 'externals/cacheInit.ts'},
			{from: './src/libs/addons/cache/worker.js', to: 'worker.js'},
			{from: './src/libs/addons/cache/offline.html', to: 'offline.html'},
			{from: './src/libs/addons/webrtc-adapter/adapter.js', to: 'externals/adapter.js'},
			{from: "./src/examples/basket-ball-chat/ui/player-board.html", to: "templates/ui/player-board.html"},
			{from: "./src/examples/basket-ball-chat/ui/select-player.html", to: "templates/ui/select-player.html"},
			{from: 'src/html-components/register.html', to: 'templates/register.html'},
			{from: 'src/html-components/login.html', to: 'templates/login.html'},
			{from: 'src/html-components/user-profile.html', to: 'templates/user-profile.html'},
			{from: './src/html-components/store.html', to: 'templates/store.html'},
			{from: './src/html-components/games-list.html', to: 'templates/games-list.html'},
			{from: './src/html-components/broadcaster2.html', to: 'templates/broadcaster2.html'},
			{from: "./src/html-components/message-box.html", to: "templates/message-box.html"},
			// Audios
      { from: "./src/examples/platformer/audios/map-themes/sb_indreams.mp3", to: "audios/sb_indreams.mp3"},
      { from: "./src/examples/platformer/audios/player/jump.mp3", to: "audios/jump.mp3"},
      { from: "./src/examples/platformer/audios/player/collect-item.mp3", to: "audios/collect-item.mp3"},
      { from: "./src/examples/platformer/audios/player/dead.mp3", to: "audios/dead.mp3"}
		], {debug: 'warn'}),
		// { debug: 'info' } make trace
	],

};

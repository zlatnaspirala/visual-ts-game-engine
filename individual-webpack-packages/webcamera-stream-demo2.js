const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const roles = [
	{
		test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
		use: [{
			loader: 'file-loader',
			options: {
				name: '[name].[ext]',
				outputPath: 'fonts/',
			}
		}]
	},
	{test: /\.tsx?$/, loader: "ts-loader"},
	{
		test: /\.(jpg|png)$/, loader: "file-loader", options: {
			name: '[name].[ext]',
			outputPath: "./imgs"
		}
	},
	{test: /\.css$/, use: ['style-loader', 'css-loader']},
	{
		test: /\.(ico)$/,
		use: {
			loader: 'file-loader',
			options: {
				name: '[name].[ext]',
				outputPath: '/styles'
			}
		}
	},
	{
		test: /\.(mp4|ogg)$/,
		loader: 'file-loader',
		options: {
			name: '[name].[ext]',
			outputPath: "/audios"
		}
	},
	{enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
];

let internalConfig = {
	createDocumentation: false,
	// stats: "errors-warnings"
};

const rootBuildPath = "build";
const appTutorialsDemo2 = "/demo2";

const resolveExtensions = {
	extensions: [".js", ".ts", ".tsx", ".json"]
};

module.exports = {

	mode: "development",
	watch: true,
	stats: internalConfig.stats,
	entry: ["./src/examples/tutorials/add-camera-stream-to-gameplay/webcamera-stream.ts"],
	output: {
		filename: "visualjs2-demo2.js",
		path: __dirname + "/../" + rootBuildPath + appTutorialsDemo2,
	},

	devtool: "hidden-source-map",

	resolve: resolveExtensions,

	module: {
		rules: roles
	},

	plugins: [
		// Make sure that the plugin is after any plugins that add images
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
			{from: './src/style/broadcaster2.css', to: 'styles/broadcaster2.css'},
			{from: './src/libs/addons/hacker-timer/hack-timer.js', to: 'externals/hack-timer.js'},
			{from: './src/libs/class/networking2/openvidu-browser-2.20.0.js', to: 'openvidu-browser-2.20.0.js'},
			// { from: './src/libs/addons/drag/drag.ts', to: 'externals/drag.ts' },
			{from: './src/libs/addons/hacker-timer/hack-timer-worker.js', to: 'externals/hack-timer-worker.js'},
			{from: './src/manifest.web', to: 'manifest.web'},
			{from: './src/libs/addons/cache/cacheInit.ts', to: 'externals/cacheInit.ts'},
			{from: './src/libs/addons/cache/worker.js', to: 'worker.js'},
			{from: './src/libs/addons/cache/offline.html', to: 'offline.html'},
			{from: './src/libs/addons/webrtc-adapter/adapter.js', to: 'externals/adapter.js'},
			{from: "./src/examples/platformer/ui/player-board.html", to: "templates/ui/player-board.html"},
			{from: "./src/examples/platformer/ui/select-player.html", to: "templates/ui/select-player.html"},
			{from: 'src/html-components/register.html', to: 'templates/register.html'},
			{from: 'src/html-components/login.html', to: 'templates/login.html'},
			{from: 'src/html-components/user-profile.html', to: 'templates/user-profile.html'},
			{from: './src/html-components/store.html', to: 'templates/store.html'},
			{from: './src/html-components/games-list.html', to: 'templates/games-list.html'},
			{from: './src/html-components/video-conference.html', to: 'templates/video-conference.html'},
			{from: './src/html-components/broadcaster2.html', to: 'templates/broadcaster2.html'},
			{from: "./src/html-components/message-box.html", to: "templates/message-box.html"},
		], {debug: 'warn'}),
	]
};

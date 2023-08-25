
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let internalConfig = {
  createDocumentation: false,
  stats: "errors-warnings"
};

let documentationPlugin = new TypedocWebpackPlugin({
  out: './api-doc',
  module: 'amd',
  target: 'es5',
  exclude: ['**/node_modules/**/*.*', '**/packs/**/*.*'],
  experimentalDecorators: true,
  excludeExternals: true,
  name: 'sn-theme',
  mode: 'file',
  theme: './sn-theme/',
  includeDeclarations: false,
  ignoreCompilerErrors: true,
});

let webPackModule = {
  mode: "development",
  watch: true,
  stats: internalConfig.stats,
  entry: ["./src/app.ts"],
  output: {
    filename: "visualjs2.js",
    path: __dirname + "/build",
  },

  devtool: "hidden-source-map",

  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  module: {
    rules: [
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
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
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
        test: /\.(mp3|mp4)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "audios/"
            }
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
    ]
  },

  plugins: [
    // Make sure that the plugin is after any plugins that add images
    new CleanWebpackPlugin(['build'], { }, { /*exclude:  ['index.html']*/}),
    new MiniCssExtractPlugin({
      linkType: "text/css",
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/register.html',
      template: 'src/html-components/register.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/login.html',
      template: 'src/html-components/login.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/user-profile.html',
      template: 'src/html-components/user-profile.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/store.html',
      template: 'src/html-components/store.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/games-list.html',
      template: 'src/html-components/games-list.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/video-conference.html',
      template: 'src/html-components/video-conference.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/broadcaster.html',
      template: 'src/html-components/broadcaster.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'templates/message-box.html',
      template: 'src/html-components/message-box.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    // new ExtractTextPlugin("src/style/styles.css"),
    new CopyWebpackPlugin([
      {from: 'src/style/broadcaster.css', to: 'styles/broadcaster.css'},
      {from: 'src/style/getHTMLMediaElement.css', to: 'styles/getHTMLMediaElement.css'},
      {from: './src/libs/addons/hacker-timer/hack-timer.js', to: 'externals/hack-timer.js'},
      {from: './src/libs/addons/drag/drag.ts', to: 'externals/drag.ts'},
      {from: './src/libs/addons/facebook/fb.js', to: 'externals/fb.js'},
      {from: './src/libs/addons/hacker-timer/hack-timer-worker.js', to: 'externals/hack-timer-worker.js'},
      {from: './src/manifest.web', to: 'manifest.web'},
      {from: './src/libs/addons/cache/cacheInit.ts', to: 'externals/cacheInit.ts'},
      {from: './src/libs/addons/cache/worker.js', to: 'worker.js'},
      {from: './src/libs/addons/cache/offline.html', to: 'offline.html'},
      {from: './src/libs/addons/webrtc-adapter/adapter.js', to: 'externals/adapter.js'},
      {from: "./src/examples/platformer/ui/player-board.html", to: "templates/ui/player-board.html"},
      {from: "./src/examples/platformer-single-player/ui/select-player.html", to: "templates/ui/select-player.html"},
      {from: "./src/examples/platformer-single-player/ui/player-board.html", to: "templates/ui/single-player-board.html"},
      { from: "./src/html-components/coordinator.html", to: "templates/coordinator.html" },
      // Audios
      {from: "./src/examples/platformer-single-player/audios/map-themes/sb_indreams.mp3", to: "audios/sb_indreams.mp3"},
      {from: "./src/examples/platformer-single-player/audios/player/jump.mp3", to: "audios/jump.mp3"},
      {from: "./src/examples/platformer-single-player/audios/player/collect-item.mp3", to: "audios/collect-item.mp3"},
      {from: "./src/examples/platformer-single-player/audios/player/dead.mp3", to: "audios/dead.mp3"}
    ], {debug: 'warn'}), // { debug: 'info' } make trace

  ],
  /*
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30,
      maxSize: 240000,
      minChunks: 4,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 3,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
  */

};

if(internalConfig.createDocumentation == true) {
  webPackModule.plugins.push(documentationPlugin);
}

module.exports = webPackModule;

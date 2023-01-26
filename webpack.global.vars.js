
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let internalConfig = {
  createDocumentation: false,
  stats: "errors-warnings"
};

module.exports = {
  rootBuildPath: "build",
  resolveExtensions: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  roles: [
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

};

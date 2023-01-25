
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
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      loader: 'file-loader',
      options: { outputPath: '/' }
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
      test: /\.(mp4|ogg)$/,
      // include: __dirname + "/src/examples/platformer-single-player/audios",
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: "/audios"
      }
    },
    // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},

    {
      test: /\.(woff|ttf|otf|eot|woff2|svg)$/i,
      loader: "file-loader"
    }

  ]

};

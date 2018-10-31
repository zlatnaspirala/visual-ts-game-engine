
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
    mode: "development",
    watch: true,
    entry: "./src/app.ts",
    output: {
        filename: "visualjs2.js",
        path: __dirname + "/build"
    },

    devtool: "inline-source-map",

    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.(jpg|png)$/, loader: "file-loader", options: {
                    name: '[name].[ext]',
                    outputPath: "./imgs"
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
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
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        // Make sure that the plugin is after any plugins that add images
        new CleanWebpackPlugin(['build'], { /*exclude:  ['index.html']*/ }),
        new HtmlWebpackPlugin({
            filename: 'app.html',
            template: 'src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: '/templates/register.html',
            template: 'src/html-components/register.html'
        }),
        new HtmlWebpackPlugin({
            filename: '/templates/login.html',
            template: 'src/html-components/login.html'
        }),
        new ExtractTextPlugin("styles.css")
    ]
    /*
    new TypedocWebpackPlugin({
        out: './api-doc',
        module: 'amd',
        target: 'es5',
        exclude: '** /node_modules / ** / *.* ',
        experimentalDecorators: true,
        excludeExternals: true,
        name: 'sn-theme',
        mode: 'file',
        theme: './sn-theme/',
        includeDeclarations: false,
        ignoreCompilerErrors: true,
    })
    */

    /**
    * When importing a module whose path matches one of the following, just
    * assume a corresponding global variable exists and use that instead.
    * This is important because it allows us to avoid bundling all of our
    * dependencies, which allows browsers to cache those libraries between builds.
    *
    * No active for now , looks like no benefit from react for canvas drawing

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    */

};

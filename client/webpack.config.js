const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const currentYear = new Date().getFullYear();
module.exports = (env) => {

    return {
        // mode: 'production',
        // entry: { app: './src/index.js' },
        entry: './src/index.js',
        // entry: ['babel-polyfill', './src/index.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            // filename: 'bundle.js',
            // path: path.join(__dirname, 'dist'),
            // path: 'dist',
            // filename: "bundle.js",

            // path: path.resolve('dist/js'),
            
            filename: '[name].[hash].js',
            // publicPath: path.resolve("/public/assets/js")   
            publicPath: '/',
        },
        resolve: {extensions: ['.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader?limit=8192'
                        }
                    ],
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {minimize: true},
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    // exclude: /node_modules/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        }
                    ]
                }
            ],
        },
        devServer: {
            port:'3000',
            proxy: {
                '/api': 'http://localhost:3001',
                '/login': 'http://localhost:3001',
                '/logout': 'http://localhost:3001',
                '/auth': 'http://localhost:3001',
                '/callback': 'http://localhost:3001',
            },
            static: './dist',
            // contentBase: './dist',
            hot: true,
            historyApiFallback: true
        },
        devtool: 'inline-source-map',
        plugins: [
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
                DEBUG: false
            }),
            new HtmlWebPackPlugin({
                // favicon: './public/favicon.ico',
                template: './public/index.html',
                filename: './index.html'
                // filename: './src/index.js'
            }),
            new CleanWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new MomentTimezoneDataPlugin({
                startYear: currentYear - 2,
                endYear: currentYear + 10,
              }),
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    },
                },
            },
        },
    };
}


import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

import paths from './paths';

module.exports = env => ({
    entry: paths.entryPath,
    output: {
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.ts|tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                /*
                   webpack uses a regular expression to determine which files it should look for and serve to a specific loader.
                   In this case any file that ends with .css will be served to the style-loader and the css-loader.
                  */
                  test: /src\/article\.css$/,
                  use: [
                    { loader: "style-loader/url" },
                    { loader: "file-loader" }
                  ]
            },
            {
                test: /\.css/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                      loader: 'css-loader',
                      options: {
                        modules: {
                            localIdentName:'[name]__[local]--[hash:base64:5]',
                        },
                        sourceMap: true,
                      },
                    },
                ],
            },
            {
                test: /\.css/,
                include: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                      loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                          modules: {
                              localIdentName:'[name]__[local]--[hash:base64:5]',
                          },
                          sourceMap: true,
                          esModule: true,
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                        implementation: require('sass'),
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                include: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            modifyVars: {
                                // 'primary-color': '#1DA57A',
                                // 'link-color': '#1DA57A',
                                // 'border-radius-base': '2px',
                                // or
                                // 'hack': `true; @import "your-less-file-path.less";`, // Override with less file
                            },
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            },
            {
                test: /\.(woff|woff2)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            prefix: 'font',
                            limit: 5000,
                        }
                    },
                ],
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            mimetype: 'application/octet-stream',
                            limit: 10000,
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource',
                // use: [
                //     {
                //         loader: 'url-loader',
                //         options: {
                //             limit: 10000,
                //             esModule: false,
                //         },
                //     },
                //     {
                //         loader: 'img-loader',
                //     },
                // ],
            }
        ],
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
        alias: {
            '~': path.resolve(paths.root, 'src/') // added this: ts alias import
        },
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: paths.templatePath,
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                preserveLineBreaks: true,
                minifyURLs: true,
                removeComments: true,
                removeAttributeQuotes: false
            }
        }),
        new FaviconsWebpackPlugin({
            logo: path.join(paths.root, 'src/asset/image/favicon.png'),
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new WebpackManifestPlugin({}),
    ],
});

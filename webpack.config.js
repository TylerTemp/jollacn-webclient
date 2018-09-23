const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     entry: './src/index.js', //相对路径
//     output: {
//         path: path.resolve(__dirname, 'build'), //打包文件的输出路径
//         filename: 'bundle.js' //打包文件名
//     }
// }


// module.exports = {
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: './public/index.html', //指定模板路径
//             filename: 'index.html', //指定文件名
//         })
//     ]
// }


module.exports = {
    entry: './src/index.jsx', //相对路径
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'), //打包文件的输出路径
        // publicPath: 'build',
        filename: 'bundle.js' //打包文件名
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', //指定模板路径
            filename: 'index.html', //指定文件名
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        historyApiFallback: true,
        disableHostCheck: true,
        compress: true,
        // historyApiFallback: {index: "build/index.html"},
    },
    module: {
        rules: [ //配置加载器
            {
              test: /\.jsx$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                  presets: ['env', 'react']
              }
            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader'
            },
            {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              loader: "file-loader"
            },
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                  limit: 10000, //1w字节以下大小的图片会自动转成base64
                },
            }
        ]
    },

    resolve: {
      extensions: ['.js', '.jsx']
    }
}

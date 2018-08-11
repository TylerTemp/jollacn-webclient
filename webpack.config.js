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
    entry: './src/index.js', //相对路径
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'), //打包文件的输出路径
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
    },
    module: {
        rules: [ //配置加载器
            // {
            //     test: /\.js$/,
            //     enforce: 'pre', //加载器的执行顺序，不设置为正常执行，pre（前）|post（后），eslint是检查代码规范，应该在编译前就执行
            //     loader: 'eslint-loader',
            // },
            {
                test: /\.js$/, //配置要处理的文件格式，一般使用正则表达式匹配
                loader: 'babel-loader', //使用的加载器名称
                query: { //babel的配置参数，可以写在.babelrc文件里也可以写在这里
                    presets: ['env', 'react']
                }
            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader'
            },
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                  limit: 10000, //1w字节以下大小的图片会自动转成base64
                },
            }
        ]
    }
}

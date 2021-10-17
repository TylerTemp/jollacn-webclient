import webpack from 'webpack';

import paths from './paths';

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: paths.outputPath,
        chunkFilename: '[name].js'
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 450000,
        maxEntrypointSize: 8500000,
        assetFilter: assetFilename => {
            return (
                assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
            );
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true
            },
        },
        static: paths.outputPath,
        allowedHosts: 'all',
        compress: true,
        hot: true,
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: '/index.html'},
            ],
        },
        port: 8081,  // change this
        proxy: {
            '/api': {
                // target: 'https://notexists.top'
                target: 'http://localhost:8082',  // change this
                pathRewrite: {'^/api' : ''}
            },
            // '/static': {
            //     target: 'http://localhost:8082',
            // }
        },
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({
            // multiStep: true
        })
    ],
};

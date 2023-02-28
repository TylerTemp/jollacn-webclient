import webpack from 'webpack';

import paths from './paths';

module.exports = env => ({
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
            logging: 'verbose',
        },
        static: paths.outputPath,
        allowedHosts: 'all',
        compress: true,
        // hot: true,  // 默认就是true
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: '/index.html'},
            ],
        },
        port: 8081,  // change this
        proxy: {
            '/api': {
                target: (env['API'] || 'https://notexists.top'),
                // target: 'http://localhost:8082',  // change this
                // pathRewrite: {'^/api' : ''},
                secure: false,
                changeOrigin: true,
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
});

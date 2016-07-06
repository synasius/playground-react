var webpack = require("webpack");

module.exports = {
    devtools: 'source-map',
    entry: {
        app: './client/js/toggle.js',
        vendor: ['jquery', 'react', 'react-dom', 'moment']
    },
    module: {
        loaders: [
            {
                test: /\.js?/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react']
                }
            }
        ]
    },
    output: {
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};

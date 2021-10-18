const path = require('path');
const merge = require('webpack-merge');
const appCommonConfig = require('./webpackCommon.js');

module.exports = env => {
    const environment = env || {}
    environment.mode = 'development'

    const config = merge.merge(appCommonConfig(environment), {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, '../public'),
            host: 'localhost',
            port: 9000,
        }
    });
    return config
}



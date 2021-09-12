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
            //host: 'localhost',
            //host: '192.168.0.160',
            //host: '192.168.0.101', // work vasya
            //host: '192.168.42.75',
            host: '192.168.10.2', // home vasya
            // host: 'localhost',
            compress: true,
            port: 9000,
            allowedHosts: ['ci.ait']
        }
    });
    return config
}




const merge = require('webpack-merge');
const appCommonConfig = require('./webpackCommon.js');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const namesFiles = require('./preNamesFiles')


const preNameFiles = namesFiles.getPreNamesFiles()


module.exports = env => {
    const environment = env || {}
    environment.mode = 'production'

    const plugins = []
    plugins.push(new CleanWebpackPlugin())


    const config = merge.merge(appCommonConfig(environment), {
        //mode: 'development',
        //devtool: 'inline-source-map',
        mode: 'production',
        output: {
            path: path.resolve(__dirname, '../../dist'),
            filename: `${ preNameFiles }app.bundle.js`
        },
        plugins: plugins
    });

    return config
}
const webpack = require('webpack')

console.log(process.env)
module.exports = (config, env) => {
  config.plugins.push(
      new webpack.ProvidePlugin({
          'window.PIXI': 'pixi.js-legacy',
      }),
  )
  return config
}

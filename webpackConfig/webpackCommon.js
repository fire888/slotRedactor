const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')



module.exports = env => {

    return ({
        entry: './src/index.js',
        module: {
            rules: [
                {
                    test: /\.(png|svg|jpg|webp)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: `[path][name].[ext]`,
                        }
                    }]
                },
                {
                    test: /\.(gif)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }]
                },
                {
                    test: /\.txt$/,
                    loader: 'file-loader',
                },
                {
                    test: /\.atlas$/,
                    loader: 'file-loader',
                    options: {
                        name: `[path][name].[ext]`,
                    }
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(wav|ogg|mp3)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: `[name].[ext]`,
                            outputPath: 'audio/'
                        }
                    }]
                },
                {
                    type: 'javascript/auto',
                    test: /\.(json|fnt)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: `[path][name].[ext]`,
                        }
                    }]
                },
                {
                    test: /\.(ttf)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'templates/index.html',
                //pathShortcut: `src/assets/z.png`
            }),
            new webpack.ProvidePlugin({
                'PIXI': 'pixi.js-legacy',
            }),
        ]
    })
}
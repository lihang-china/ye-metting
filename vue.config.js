/*
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-27 08:52:07
 * @LastEditors: Your Name
 * @LastEditTime: 2021-10-09 14:27:22
 */
var webpack = require('webpack')
    // vue.config.js 配置说明
    // 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
    // 这里只列一部分，具体配置参考文档
module.exports = {
    outputDir: 'dist',
    // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: 'static',
    // 是否开启eslint保存检测，有效值：ture | false | 'error'
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    // webpack-dev-server 相关配置
    devServer: {

        proxy: {
            '/api': {
                target: 'http://xx:xx', // 后台接口域名
                ws: true, // 如果要代理 websockets，配置这个参数
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        plugins: [
   new CompressionPlugin({
                test: /\.(js|css)(\?.*)?$/i, //需要压缩的文件正则
                threshold: 10240, //文件大小大于这个值时启用压缩
                deleteOriginalAssets: false //压缩后保留原文件
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 4
            })
        ]
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test
            // set svg-sprite-loader
        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {

                                'src': {
                                    name: 'src',
                                    test: /[\\\/]src[\\/]/,
                                    priority: 100
                                },
                                '@fullcalendar': {
                                    name: 'fullcalendar',
                                    test: /[\\\/]node_modules[\\/]_?@fullcalendar[\\\/]/,
                                    priority: 110
                                }

                            }
                        })
                }
            )
    }
}
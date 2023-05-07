const path = require('path')
const os = require("os")
const threads = os.cpus().length
const ESlintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// 内置多线程插件
const TerserWebpackPlugin = require("terser-webpack-plugin")
module.exports = {
    // 入口
    entry: './src/main.js', // 相对路径 不需要更改
    // 输出
    output: {
        // 输出路径
        // __dirname nodejs的变量，表示当前文件的文件目录
        // 绝对路径需要回退 -- 以当前文件位置来设置的
        path: path.resolve(__dirname, '../dist'),
        // 文件名
        filename: 'static/js/main.js',
        clean: true // 每次打包时清除上次打包记录
    },
    // 加载器
    module: {
        // loader的配置
        rules: [
            // css-loader的配置
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", // 将css资源编译成commonjs的模块到js中
                    {
                        // 注意postcss-loader配置位置
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env" // css预设，解决大多数样式兼容性问题
                                ]
                            }
                        }
                    }
                ]
            },
            // 图片资源配置
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/i,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        // 小于10kb自动转为base64格式，base64格式减少请求数量，但是体积会变大
                        // （压力来到了客户端这边）
                        maxSize: 10 * 1024 // 10kb
                    }
                },
                generator: {
                    // 输出图片名称 -- 将图片打包到dist/static/images/
                    // 注意与output里的区别 -- output的是针对所有文件 
                    // [hash:10]表示取名称前10位 -- 因为打包过后会给打包图片命名一串hash值
                    filename: "static/images/[hash:10][ext][query]"
                }
            },
            // babel-loader
            {
                test: /\.js$/,
                // exclude: /node_modules/, // 排除编译node_modules文件
                include: path.resolve(__dirname, "../src"), // 只处理src下的文件，其他文件不处理 
                use: [
                    {
                        // 给Babel开启多线程
                        loader: 'thread-loader',
                        options: {
                            works: threads // 启动进程数
                        }
                    }, {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            cacheDirectory: true, // 开启babel缓存
                            cacheCompression: false, // 关闭缓存文件压缩
                        }
                    }],
                // use 可换成 下方写法
                // loader: 'babel-loader',
                // options: {
                //     presets: ['@babel/preset-env']
                // }
            }
        ]
    },
    // 插件
    plugins: [
        // ESlint 的配置
        new ESlintWebpackPlugin({
            // 只检查src目录下的代码
            context: path.resolve(__dirname, '../src'),
            threads, // 开启多线程，和进程数量
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache")
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 文件为基准创建新的html文件
            // 这样可以保证结构跟原来一致，并且会自动引入打包资源
            // 如果不加，系统会自动生成新的html文件不保留原有的
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new MiniCssExtractPlugin({
            // 输出的每个 CSS 文件的名称，也可同时设置目录
            filename: 'static/css/main.css'
        }),
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin({
            parallel : threads
        }) // 开启多线程
    ],
    // 模式
    mode: 'production',
    // 开发服务器 - 开发环境不会打包
    // 生产模式不需要启动开发服务器
    // devServer: {
    // 	host: "localhost", // 启动服务器的域名
    // 	port: "3000", // 启动服务器的域名
    // 	open: true // 是否自动打开浏览器
    // }
}
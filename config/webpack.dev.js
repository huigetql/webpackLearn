const path = require('path')
const ESlintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // 入口
    entry:'./src/main.js',
    // 输出
    output: {
        // 输出路径
        // __dirname nodejs的变量，表示当前文件的文件目录
        // 开发模式不需要输出
        path: undefined,
        // 文件名
        filename:'static/js/main.js'
    },
    // 加载器
    module : {
        // loader的配置
        rules:[
            // css-loader的配置
            {
              test: /\.css$/i,
              use : [
                // 执行顺序 从右往左（即先加载css-loader后执行style-loader）
              	"style-loader", // 将js中css通过创建动态style标签添加到html文件中
              	"css-loader" // 将css资源编译成commonjs的模块到js中
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
                exclude: /node_modules/, // 排除编译node_modules文件
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                },
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
            context: path.resolve(__dirname,'../src')
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 文件为基准创建新的html文件
            // 这样可以保证结构跟原来一致，并且会自动引入打包资源
            // 如果不加，系统会自动生成新的html文件不保留原有的
            template: path.resolve(__dirname,'../public/index.html')
        })
    ],
    // 模式
    mode:'development',
    // 开发服务器 - 开发环境不会打包
	devServer: {
		host: "localhost", // 启动服务器的域名
		port: "3000", // 启动服务器的域名
		open: true, // 是否自动打开浏览器
        hot: true // 开启HMP功能(只用于开发环境，生产环境也不需要启动服务，或者说生产环境也不会让你实时打包)
	}
}
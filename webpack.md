# webpack

## 安装

```tiki wiki
// 环境 
node 16.14.2
// 初始化项目
npm init -y
// 安装webpack
npm install webpack webpack-cli -D
// 打包
npx webpack ./src/main.js --mode=development
// 配置webpack.config.js文件后可无需加./src/main.js --mode=development
npx webpack
```

## 核心概念

1. entry(入门)

   指示webpack从哪个文件开始打包，可以多个

2. output(输出)

   指示webpack将打包完的文件输出到哪去

3. loader(加载器)

   webpack本身只能处理js、json等资源，其他资源需要借助loader，webpack才能解析

4. plugins(插件)

   扩展webpack功能

5. mode(模式)

   开发模式：development

   生产模式：production



## 热更新

安装

```
npm i -D webpack-dev-server
```

配置

```
// webpack.config.js
module.exports = {
	// 开发服务器 - 开发环境不会打包
	devServer: {
		host: "localhost", // 启动服务器的域名
		port: "3000", // 启动服务器的域名
		open: true // 是否自动打开浏览器
	}
}
```

此时启动项目命令更改为

```
npx webpack serve
```



## 基础

package.json同级下创建 <font style="color:red;">webpack.config.js</font>文件

```javascript
module.exports = {
    // 入口
    entry:'./src/main.js',
    // 输出
    output: {
        // 输出路径
        // path是全部文件打包地址
        // __dirname nodejs的变量，表示当前文件的文件目录
        path: path.resolve(__dirname,'dist'),
        // 文件名 -- 将文件打包到dist/js/目录下
        filename:'js/main.js',
        // 自动清空上次打包结果,即清空dist文件
        // webpack4 使用 cleanWebpackPlugin 插件
        clean: true
    },
    // 加载器
    module : {
        rules:[
            // loader的配置
        ]
    },
    // 插件
    plugins: {
        // plugin的配置
    },
    // 模式
    mode:'development'
}
```

### loader

#### css-loader

```
// 安装 css-loader
npm i --save-dev css-loader
#### 坑处 官方文档没有指出需要安装style-loader，但在配置中却使用，这将会报错 ####
// 安装 style-loader
npm i --save-dev style-loader 

// webpack.config.js配置
module.exports = {
	··· 
	
    module : {
        // loader的配置
        rules:[
            // css-loader的配置
            {
              test: /\.css$/i,
              // loader :'xxx' 只能使用1个loader，下方use能使用多个
              use : [
                // 执行顺序 从右往左（即先加载css-loader后执行style-loader）
              	"style-loader", // 将js中css通过创建动态style标签添加到html文件中
              	"css-loader" // 将css资源编译成commonjs的模块到js中
              	]
            }
        ]
    },
    
   ···
}
```

#### less-loader

```
// 安装
npm i less less-loader -D

 {
 	test: /\.less$/i,
    use : [
       "style-loader", 
       "css-loader",
       "less-loader" // 将less文件编译成css文件
       ]
  }

```

#### sass-loader

```
// 安装
npm i sass sass-loader -D

 {
 	test: /\.s[ac]ss$/i,
    use : [
       "style-loader", 
       "css-loader",
       "sass-loader" // 将sass文件编译成css文件，注意这里是sass不是scss
       ]
  }

```

#### stylus-loader

类似 上面几个

### 插件

[各类插件](https://webpack.docschina.org/plugins/)

每个插件都是构造函数，需要new调用

#### HtmlWebpackPlugin

会自动将HTML文件自动打包，并引入相关JS文件，无需每次手动更改 引入文件

[详细用法](https://webpack.docschina.org/plugins/html-webpack-plugin/)

安装

```
npm i -D html-webpack-plugin
```

使用

```
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...
  plugins: [new HtmlWebpackPlugin({
  	// 以 public/index.html 文件为基准创建新的html文件
    // 这样可以保证结构跟原来一致，并且会自动引入打包资源
    // 如果不加，系统会自动生成新的html文件不保留原有的
    template: path.resolve(__dirname,'public/index.html')
  })],
  // ...
};
```



### 资源模块（asset）

- webpack 4：
  - raw-loader 将文件导入为字符串
  - url-loader 将文件作为data URI内联到bundle中
  - file-loader 将文件发送到输出目录
- webpack 5：
  - asset/resource 发送一个单独的文件并导出URL（file-loader）
  - asset/inline 导出一个资源的data URI（url-loader）
  - asset/source 导出资源的源代码（raw-loader）
  - asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现

#### image

```
// webpack5 配置
module : {
	rules : [
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
   	}
   ]
}
 
```

#### iconfont

```
module : {
	rules : [
	{
        test: /\.(ttf|woff2?)$/i,
        type: "asset/resource",
        generator: {
        	filename: "static/media/[hash:10][ext][query]"
        }
   	}
   ]
}
 
```



## 处理js资源

#### Eslint

可组装的javascript和jsx(react)的检查工具 -- 用来检测js和jsx语法的工具，可以配置各项功能

使用Eslint关键是写Eslint配置文件，里面写上各种rules规则，将来运行页面时，Eslint会自动对代码进行检查

##### 1.配置文件

- `.eslintrc.*`： 新建文件，位于项目根目录，下面三种都可以，配置格式不同（按照各类型文件写法）
  - `.eslintrc`
  - `.eslintrc.js`
  - `.eslintrc.json`
- `package.json`：再eslintConfig中配置，不需要额外创建文件，在原有文件基础上写
- `.eslintignore`：可忽略检测文件

##### 2.具体配置

[详见具体配置](https://www.eslint.com.cn/docs/user-guide/configuring)

以.eslintrc.js为例

```javascript
module.exports = {
    // 解析选项
    parserOptions: {},
    // 具体检查规则
    rules:{},
    // 继承其他规则
    extends: [],
    // 插件
    plugins: ["import"] // 解决动态导入import语法报错问题
    // ... 等等
}
```

1.parserOptions 解析选项

```javascript
parserOptions:{
    ecmaVersion: 6, // ES语法版本
	sourceType: "module", // ES模块化
    ecmaFeatures:{
        //ES 其他特性
        jsx: true // 如果是React项目，则需要开启
    }
    // ... 等等
}
```

2.rules 具体规则

- "off" 或 0 则关闭规则
- "warn" 或 1 则开启规则，使用警告级别的错误：warn(程序不会退出，黄色警告)
- "error" 或 2 则开启规则，使用错误级别的错误：error(程序会退出，红色警告)

```javascript
rules: {
    semi: "error", // 禁止使用分号
    'array-callback-return': "warn", // 强制数组回调中有return语句，否则警告
    eqeqeq: [ // 强制使用 === 或 !==  ，否则警告
        "warn","smart"
    ]
    // ... 等等
}
```

3.extends 继承

可以直接用现有的规则 -- 即别人已经写好的规则

- `Eslint` 官方规则：eslint:recommended
- `Vue Cli` 官方规则：plugin:vue/essential
- `React Cli`官方规则：react-app

```javascript
module.exports = {
    extends: ["react-app"],
    // 本地规则会覆盖继承的规则 ↓↓↓
    rules: {}
}
```

##### 3.具体使用（eslint-webpack-plugin）

安装

```
npm install eslint eslint-webpack-plugin -D
```

添加到webpack配置 -- 注意 这是一个插件

```
const ESlintWebpackPlugin = require('eslint-webpack-plugin')

// ...
 plugins: [
        // ESlint 的配置
        new ESlintWebpackPlugin({
            // 只检查src目录下的代码
            context: path.resolve(__dirname,'src')
        })
    ],
// ...
```

#### Babel

JavaSript 编译器
主要用于将ES6 语法编写的代码转换为向后兼容的 JavaScript语法，以便能够运行在当前和旧版本的浏览器或其他环境中

##### 1.配置文件

- `babel.config.*`： 新建文件，位于项目根目录，下面三种都可以，配置格式不同
  - `babel.config.js`
  - `babel.config.json`
- `.babelrc.*`：新建文件，位于项目根目录，下面三种都可以，配置格式不同
  - `.babelrc`
  - `.babelrc.js`
  - `.babelrc.json`
- `package.json`中`babel`：不需要创建文件，在原有文件基础上写

##### 2.具体配置

[详见具体配置](https://www.babeljs.cn/docs/presets)

以 babel.config.js为例

```javascript
module.exports = {
    // 继承
    extends: "",
    // 预设
    presets: [],
    // 插件
    plugins: []
}
```

1.presets 预设

简单理解：一组Babel插件，扩展Babel功能

- `@babel/preset-env`：智能预设，允许使用最新的javascript（如箭头函数转为普通函数）
- `@babel/preset-react`：编译React jsx 语法的预设
- `@babel/preset-typescript`：编译TypeScript语法的预设



##### 3.具体使用(babel-loader)

安装 

```
npm install -D babel-loader @babel/core @babel/preset-env
```

添加到webpack配置 -- 注意这是一个loader

```
module.exports = {
	// ...
	rules: [
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
	// ...
}
```

上面可以不需要写options，可以在项目目录下创建`.babelrc.js`文件

```
// .babelrc.js文件
module.exports = {
	presets: ["@babel/preset-env"] // 智能预设
}
```

## 生产模式

配置

```
// config/webpack.prod.dev
module.exports = {
	// ...
	mode:'production'
	// 此时并不需要写devServer，生产模式只需要打包就可
	// ...
}
```

启动

```
// 由于不需要启动服务，所以不需要加serve
npx webpack ./config/webpack.prod.dev
```

### Css兼容性处理

#### postcss

安装

```
npm i postcss-loader postcss postcss-preset-env -D
```

配置

```
// webpack.prod.js
module.exports = {
	// ...
	module:{
		rules: [{
              test: /\.css$/i,
              use : [
                MiniCssExtractPlugin.loader,
              	"css-loader",
              	// 注意postcss-loader配置位置
                {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                        	plugins: [
                            "postcss-preset-env" // css预设，解决大多数样式兼容性问题
                        	]
                        }
                    }
                },
                'sass-loader'
              	]
            }]
	}
	// ...
}
```

### 控制兼容性

可在`package.json`文件中添加`browserslist`来控制样式的兼容性做到什么程度

[更多配置](https://github.com/browserslist/browserslist)

举例：

```
// package.json
{
	"browserslist": [
	"last 2 version", // 所有浏览器只需要最近的2个版本
	"> 1%", // 覆盖99%的浏览器
	"not dead" // 不要已经不用的
	]
}
```



### 插件

#### MiniCssExtractPlugin

将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

[详细用法](https://webpack.docschina.org/plugins/mini-css-extract-plugin)

安装

```
npm install -D mini-css-extract-plugin
```

使用

```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	// ...
	module: {
		rules:[{
			{
              test: /\.css$/i,
              use : [
               // 注意需要将'style-loader'改成如下
               // style-loader会通过JS创建CSS标签到html中，而JS会阻塞页面加载，将会造成闪屏现象
               // MiniCssExtractPlugin.loader会创建一个新的css文件，通过link引入
                MiniCssExtractPlugin.loader,
              	"css-loader" // 将css资源编译成commonjs的模块到js中
              	]
            },
		}]
	},
	plugins: [
	 	new MiniCssExtractPlugin({
            // 输出的每个 CSS 文件的名称，也可同时设置目录
            filename : 'static/css/main.css'
        })
	]
	
	// ...
}
```

#### CssMinimizerWebpackPlugin

这个插件使用 [cssnano](https://cssnano.co/) 优化和压缩 CSS。

[详细用法](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/)

安装

```
npm install css-minimizer-webpack-plugin -D
```

使用

```
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	// ...
	module: {
		rules:[
			{
              test: /\.css$/i,
              use : [
               // 注意需要将'style-loader'改成如下
               // style-loader会通过JS创建CSS标签到html中，而JS会阻塞页面加载，将会造成闪屏现象
               // MiniCssExtractPlugin.loader会创建一个新的css文件，通过link引入
                MiniCssExtractPlugin.loader,
              	"css-loader" // 将css资源编译成commonjs的模块到js中
              	]
            },
		]
	},
	// 官方写法
	optimization: {
    	minimizer: [
      	  new CssMinimizerPlugin(),
    	],
  	},
	plugins: [
	// 实际可以直接在plugins里使用
	 	new CssMinimizerPlugin()
	]
	
	// ...
}
```



## 高级优化

### 提升开发体验

##### SourceMap

用于生成`源代码`与`构建后代码`一一映射的文件的方案

一句话总结：生产模式下会对js文件自动打包压缩，形成难以理解的打包文件，这时文件出错后难以定位到准确的出错文件及错误位置，开启SourceMap后代码出错后更容易找到源代码文件及出错位置

[详细使用](https://webpack.docschina.org/configuration/devtool#root)

- 开发模式： `cheap-module-source-map`
  - 优点：打包编译速度快
  - 缺点：只有行映射，没有列映射

```javascript
module.exports = {
    mode:"development",
    devtool: "cheap-module-source-map"
}
```



- 生产模式： `source-map`
  - 优点：包含行、列映射
  - 缺点：打包编译速度更慢，生产环境不建议打开，会让别人也看到源代码

```javascript
module.exports = {
    mode:"production",
    devtool: "source-map"
}
```

### 提升打包/构建速度

每次更改一部分模块时，webpack会重新构建打包所有模块，这会导致写大项目时构建速度会非常慢

#### HotModulePeplacement

HMP: 热模块更新

在程序运行中，替换、添加或者删除模块时，无需重新下载整个页面

使用

```javascript
// config/webpack.dev.js
module.exports = {
	// ...
    devServer:{
        host:"localhost",
        port: "3000",
        hot: true // 开启HMP功能(只用于开发环境，生产环境也不需要启动服务，或者说生产环境也不会让你实时打包)
    }
    // ...
}
```

#### OneOf

打包构建时每个文件都会经过所有loader处理，即在rules中通过第一个{}处理了还会通过下一个{}处理。相当于if---if---if...

通过oneOf配置后只能匹配上一个loader。相当于if---if else---if else---else



```javascript
module.exports = {
	// ...
	module: {
		rules:[
            {
               // 注意第一个字母小写
               oneOf:  {
            	  test: /\.css$/i,
            	  use : [
            	   // 注意需要将'style-loader'改成如下
            	   // style-loader会通过JS创建CSS标签到html中，而JS会阻塞页面加载，将会造成闪屏现象
             	   // MiniCssExtractPlugin.loader会创建一个新的css文件，通过link引入
             	   MiniCssExtractPlugin.loader,
             	   "css-loader" // 将css资源编译成commonjs的模块到js中
              	]
            	}
            },
		]
	},
	// ...
}
```

#### Include/Exclude

开发时通常需要第三方库或者插件，所有文件都下载到node_modules中。这些文件是不需要编译就能直接使用，所以我们需要排除这个文件，以免重复操作

- include：包含，只处理 xxx 文件
- exclude：排除，除了 xxx 文件，其他文件都处理

使用

```javascript
module.exports = {
	// ...
	module: {
		rules:[
           {
                test: /\.js$/,
                // exclude: /node_modules/, // 排除编译node_modules文件
                include: path.resolve(__dirname,"../src"), // 只处理src下的文件，其他文件不处理 
                loader: 'babel-loader',
                 options: {
                     presets: ['@babel/preset-env']
                 }
            }
		],
        plugins: [
             // ESlint 的配置
        	new ESlintWebpackPlugin({
           		// 只检查src目录下的代码
            	context: path.resolve(__dirname, '../src')
        	}),
        ]
	},
	// ...
}
```

#### Cache

每次打包时 js 文件都要经过 Eslint检查和 Babel 编译，速度比较慢。

我们以缓存之前的 Eslint 检查和 Babel 编译结果，这样第二次打包速度就会更快一些

使用

```javascript
module.exports = {
	// ...
	module: {
		rules:[
           {
                test: /\.js$/,
                // exclude: /node_modules/, // 排除编译node_modules文件
                include: path.resolve(__dirname,"../src"), // 只处理src下的文件，其他文件不处理 
                loader: 'babel-loader',
                 options: {
                     presets: ['@babel/preset-env'],
                     cacheDirectory : true, // 开启babel缓存
                     cacheCompression: false, // 关闭缓存文件压缩
                 }
            }
		],
        plugins: [
             // ESlint 的配置
        	new ESlintWebpackPlugin({
           		// 只检查src目录下的代码
            	context: path.resolve(__dirname, '../src'),
                cache:true, // 开启缓存
                cacheLocation: path.resolve(__dirname,"../node_modules/.cache/eslintcache")
        	}),
        ]
	},
	// ...
}
```

#### Thread

多进程打包

<font color="red">仅在特别耗时的操作中使用，因为每个进程启动就有大约 600ms 的时间</font>

使用

1. 获取cpu核数

   ```
   const os = require("os")
   const threads = os.cpus().length
   ```

2. 安装

   ```
   npm i thread-loader -D
   ```

3. 配置

   ```
   // 内置多线程插件
   const TerserWebpackPlugin = require("terser-webpack-plugin")
   module.exports = {
   	// ...
   	module: {
   		rules:[
              {
                   test: /\.js$/,
                   // exclude: /node_modules/,
                   include: path.resolve(__dirname,"../src"), 
                   use: [
                   {	
                   // 给Babel开启多线程
                   	loader: 'thread-loader',
                   	options: {
                   		works: threads
                   	}
                   },
                  	{
                  	 	loader: 'babel-loader',
                  		options: {
                       	presets: ['@babel/preset-env']
                    	}
                  	}
                   ]
               }
   		],
           plugins: [
                // ESlint 的配置
           	new ESlintWebpackPlugin({
              		// 只检查src目录下的代码
               	context: path.resolve(__dirname, '../src'),
               	threads}),
                 new TerserWebpackPlugin({
             		  parallel : threads
          		  }) // 开启多线程
           ]
   	},
   	// ...
   }
   ```

   

### 减少代码体积

#### Tree Shaking

移除 JavaScript 中没有使用的的代码，**依赖`ES Module`**

场景：引入第三方工具包时，里面很多东西用不到，但是打包会把所有的打包起来，导致体积过大

**Webpack 默认开启功能**



#### Babel

Babel 为编译的每个文件都插入了辅助代码，导致代码体积过大

比如会对一些公共方法使用很小的辅助代码，这会因为重复引入导致包变大

应该把这些辅助代码作为一个独立完整的模块，统一引入

安装 `@babel/plugin-transform-runtime`，禁用对每个文件的runtime注入，而是从这里引入所有辅助代码

```
npm i @babel/plugin-transform-runtime -D
// 可能还需要安装@babel/runtime
npm i @babel/runtime -D
```

配置

```javascript
module.exports = {
	// ...
	module: {
		rules:[
           {
                test: /\.js$/,
                // exclude: /node_modules/,
                include: path.resolve(__dirname,"../src"), 
                use: [
               	{
               	 	loader: 'babel-loader',
               		options: {
                    	presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-transform-runtime"] // 减小代码体积
                 	
                    }
               	}
                ]
            }
		]
	},
	// ...
}
```

#### Image Minimizer

本地图片压缩

安装

```
npm i image-minimizer-webpack-plugin imagein -D
```

剩下两种包

- 无损压缩

  ```
  npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
  ```

- 有损压缩

  ```
  npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
  ```

  

### 优化代码运行

#### Code Split

打包吗会将所有JS文件打包到一个文件中，体积过大会导致首页渲染时过慢。

所以这个时候应该进行代码分割（**分割文件**），生成多个JS文件，加载哪个页面就渲染哪个JS文件（**按需加载**），这样速度更快

1.配置 -- 多入口配置

```javascript
module.exports = {
    // entry: './src/main.js' // 单入口
    entry: {
        app: "./src/app.js",
        main: "./src/main.js"
    },
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: "[name].js",// webpack命名方式,[name]以文件名自己的名字命名
    }
    // ...
}
```

2.优化 -- 重复文件打包一份

```javascript
module.exports = {
    // ...
    optimization: {
    	// 代码分割配置
        splitChunks: {
            // 单入口只需配置chunks: "all"
            chunks: "all", // 对所有模块进行分割
            // 默认值
            // minSize: 20000, // 分割代码最小的大小
      		// minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      		// minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      		// maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      		// maxInitialRequests: 30, // 入口js文件最大并行请求数量
          	// enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
     		// cacheGroups: { // 组，哪些模块要打包到一个组
     		//   defaultVendors: { // 组名
      		//     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      		//     priority: -10, // 权重（越大越高）
      		//     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      		//   },
      		//   default: { // 其他没有写的配置会使用上面的默认值
      		//     minChunks: 2, // 这里的minChunks权重更大
      		//     priority: -20,
      		//     reuseExistingChunk: true,
      		//   },
      		// },
        },
        // 修改配置
      cacheGroups: {
        // 组，哪些模块要打包到一个组
        // defaultVendors: { // 组名
        //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
        //   priority: -10, // 权重（越大越高）
        //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        // },
        default: {
          // 其他没有写的配置会使用上面的默认值
          minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },

    }
    // ...
}
```

3.按需加载，动态导入

```javascript
import('./math.js')
```

4.给动态导入文件取名

```
// webpackChunkName: "math"：这是webpack动态导入模块命名的方式
// "math"将来就会作为[name]的值显示。
import(/* webpackChunkName: "math" */ "./js/math.js")

// 这需要再output文件里设置
output :{
	// ...
	filename: "static/js/[name].js", // 入口文件打包输出资源命名方式
    chunkFilename: "static/js/[name].chunk.js", // 动态导入输出资源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
	// ...
}
```



#### Preload / Prefetch

我们前面已经做了代码分割，同时会使用 import 动态导入语法来进行代码按需加载（我们也叫懒加载，比如路由懒加载就是这样实现的）。

但是加载速度还不够好，比如：是用户点击按钮时才加载这个资源的，如果资源体积很大，那么用户会感觉到明显卡顿效果。

我们想在浏览器空闲时间，加载后续需要使用的资源。我们就需要用上 `Preload` 或 `Prefetch` 技术。

- `Preload`：告诉浏览器立即加载资源。
- `Prefetch`：告诉浏览器在空闲时才开始加载资源。

它们共同点：

- 都只会加载资源，并不执行。
- 都有缓存。

它们区别：

- `Preload`加载优先级高，`Prefetch`加载优先级低。
- `Preload`只能加载当前页面需要使用的资源，`Prefetch`可以加载当前页面资源，也可以加载下一个页面需要使用的资源。

总结：

- 当前页面优先级高的资源用 `Preload` 加载。
- 下一个页面需要使用的资源用 `Prefetch` 加载。

它们的问题：兼容性较差。

- 我们可以去 [Can I Use](https://caniuse.com/) 网站查询 API 的兼容性问题。
- `Preload` 相对于 `Prefetch` 兼容性好一点。

使用

```
npm i @vue/preload-webpack-plugin -D
```

配置

```
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
// ...
	plugins: [
		new PreloadWebpackPlugin({
      		rel: "preload", // preload兼容性更好
      		as: "script", // script标签
      		// rel: 'prefetch' // prefetch兼容性更差
    	}),
	]
// ...
}
```

#### Network Cache

将来开发时我们对静态资源会使用缓存来优化，这样浏览器第二次请求资源就能读取缓存了，速度很快。

但是这样的话就会有一个问题, 因为前后输出的文件名是一样的，都叫 main.js，一旦将来发布新版本，因为文件名没有变化导致浏览器会直接读取缓存，不会加载新资源，项目也就没法更新了。

所以我们从文件名入手，确保更新前后文件名不一样，这样就可以做缓存了

生成唯一hash值

- fullhash（webpack4 是 hash）

每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。

- chunkhash

根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们 js 和 css 是同一个引入，会共享一个 hash 值。

- contenthash

根据文件内容生成 hash 值，只有文件内容变化了，hash 值才会变化。所有文件 hash 值是独享且不同的。

配置

```javascript
module.exports = {
    // ...
    output: {
        // ...
        filename: "static/js/[name].[contenthash:8].js",
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js"
    	// ...
    }
    // ... 

}
```

- 问题：

当我们修改 math.js 文件再重新打包的时候，因为 contenthash 原因，math.js 文件 hash 值发生了变化（这是正常的）。

但是 main.js 文件的 hash 值也发生了变化，这会导致 main.js 的缓存失效。明明我们只修改 math.js, 为什么 main.js 也会变身变化呢？

- 原因：
  - 更新前：math.xxx.js, main.js 引用的 math.xxx.js
  - 更新后：math.yyy.js, main.js 引用的 math.yyy.js, 文件名发生了变化，间接导致 main.js 也发生了变化
- 解决：

将 hash 值单独保管在一个 runtime 文件中。

我们最终输出三个文件：main、math、runtime。当 math 文件发送变化，变化的是 math 和 runtime 文件，main 不变。

runtime 文件只保存文件的 hash 值和它们与文件关系，整个文件体积就比较小，所以变化重新请求的代价也小。

````

module.exports = {
    // ...
    optimization: {
        // ...
        // 提取runtime文件
    	runtimeChunk: {
      		name: (entrypoint) => `runtime~${entrypoint.name}`, // 			runtime文件命名规则
    },
    	// ...
    }
    // ... 

}

````

#### Core-js

@babel/preset-env 只能处理大部分兼容性问题，如箭头函数、`...`运算符等，但是async函数、promise函数等等大部分es6的东西没法处理，所以需要`core.js`来做ES6以及以上API的 `polyfill`

`polyfill`  翻译过来就是垫片/补丁，用社区上提供的一段代码，能在某些不兼容新特性的浏览器上使用新特性

安装

```
npm i core-js -D
```

使用

- 全部引入

  ```
  // main.js
  import "core-js"
  ```

- 按需引入

  ```
  // main.js
  import "core-js/es/promise";
  ```

- 自动引入

  ```
  // .babelrc.js
  module.exports = {
      // 智能预设：能够编译ES6语法
      presets: [
        [
          "@babel/preset-env",
          // 按需加载core-js的polyfill
          { 
          	useBuiltIns: "usage", // 开启自动引入
          	corejs: { version: "3",// 版本 proposals: true } },
        ],
      ],
   };
  ```

  

#### PWA

渐进式网络应用程序（PWA - progressive web application）：提供类似于native app（原生应用程序）体验的 Web App 技术

其中能提供 **离线（offline）** 时应用程序能够继续运行的功能

内部通过Service Workers 技术实现

[详细使用](https://webpack.docschina.org/guides/progressive-web-application/)

安装

```
npm i workbox-webpack-plugin -D
```

配置

```javascript
// config/webpack.dev.js
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    // ...
    plugins: [
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ]
    // ...
}

//
```

注册生成 service-worker

```javascript
// main,js

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
```

此时如果直接通过 VSCode 访问打包后页面，在浏览器控制台会发现 `SW registration failed`。

因为我们打开的访问路径是：`http://127.0.0.1:3000/dist/index.html`。此时页面会去请求 `service-worker.js` 文件，请求路径是：`http://127.0.0.1:3000/service-worker.js`，这样找不到会 404。

实际 `service-worker.js` 文件路径是：`http://127.0.0.1:5500/dist/service-worker.js`。

1. 解决路径问题

- 下载包

```text
npm i serve -g
```

serve 也是用来启动开发服务器来部署代码查看效果的。

- 运行指令

```text
serve dist
```

## 参考

[参考](http://xxpromise.gitee.io/webpack5-docs/origin/loader.html#%E6%89%8B%E5%86%99-file-loader)
#### 为什么要构建工具

将很多重复的动作通过构建工具完成

1. 为了支持ES6
2. css前缀补全

1. css预处理器
2. 代码混淆

1. 静态资源(图片，字体文件)压缩



运行原理：

- 1、读取`webpack`的配置参数；
- 2、启动`webpack`，创建`Compiler`对象并开始解析项目；

- 3、从入口文件（`entry`）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；
- 4、对不同文件类型的依赖模块文件使用对应的`Loader`进行编译，最终转为`Javascript`文件；

- 5、整个过程中`webpack`会通过发布订阅模式，向外抛出一些`hooks`，而`webpack`的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。





#### 前端构建工具演变之路

grunt-gulp-webpack

- grunt将构建过程分为一个一个任务，每一步的打包结果缓存到本地磁盘，因为大量的IO操作，所以慢
- gulp 文件流的概念，存放在内存里



#### 为什么选择webpack

- 社区活跃
- 插件丰富

- 更新迭代快
- 配置灵活(配置plugin和loader定制个性化需求)



#### Entry

从入口文件开始，源头

- 单入口：SPA
- 多入口



#### Output

编译后的文件的输出位置

- filename
- path





#### Loaders - 翻译官

webpack本身只支持js和json两种文件格式，通过配置loaders去支持其他文件类型并比他们转化成有效的模块

本身是一个函数，接受源文件作为参数，返回转换的结果。loader解析顺序从右向左。

多个loader串行执行

为什么是从右向左执行？

compose = (f, g) =>(...args) =>f(g(...args))

```javascript
module.exports = function (src){
	return src
}
```



##### 常见的loader

babel-loader：es新语法

css-loader：.css文件的加载和解析，将css文件变成common.js的模块加入js中，内容是样式字符串，需要配合style-loader使用

style-loader：创建style标签，将js中的样式资源插入标签，并添加到head中，一般写在第一个

sass-resource-loader：.scss转化为.css

postcss-loader：补充css样式各种浏览器前缀

less-loader：.less转换为.css

ts-loader：ts转为js

file-loader：图片，字体等

thread-loader：多进程打包js和css

image-webpack-loader：图片压缩，支持很多定制选项，处理多种图片格式

url-loader：可以在limit设置根据图片大小如何打包图片，如果大于指定大小转换成base64打包进js

px2rem-loader: 自动将px转为rem 有一个配置是remUnit设置跟字体 100px 10px就会转为0.1rem



如何使用：

rules[] 放入所有使用的loader

test指定匹配规则，use指定使用的loader



#### Plugins

增强功能。用于bundle文件的优化，资源管理，环境变量注入，作用于整个构建过程

##### 常见的plugins

commons-chunk-plugin 将chunks相同的模块代码提取成公共js

html-webpack-plugin 创建html去承载输出的bundle，通过minify 设置压缩参数

uglifyjs-webpack-plugin 压缩js(内置了)

zip-webpack-plugin 打包的资源生成一个zip包

optimize-css-assets-webpack-plugin 压缩css 需要cssnano这个预处理器

dll-plugin 分离打包提高构建速度

splitChunkPlugin 分离公共代码

external 使用cdn的方式引入基础库

thread-loader happypack 多进程解析

terser-webpack-plugin 多进程压缩

webpack-bundle-analyze 体积分析

speed-measure-webpack-plugin 速度监控

```javascript
class MyPlugin{
	apply(compiler){
  	compiler.hooks
  }
}
module.exports = MyPlugin
```



#### Mode

指定当前的构建环境

- development
- production

- none 不开启任何选项



#### 模块打包原理

为每个模块创造了一个可以导出和导入的环境，本质上并没有修改 代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致。



#### 文件监听

发现源码变化时，自动重新构建输出新的输出文件

- webpack命令加上 --watch
- 配置中设置watch：true

原理：轮询判断文件的最后编辑时间，如果发生了变化，缓存起来，等aggregateTimeout后再执行(默认300ms)。



#### ⾃动清理构建⽬录

避免每次构建前手动删除dist

clean-webpack-plugin 默认会删除 output 指定的输出⽬录



#### 资源内联

意义

- 初始化脚本
- 上报相关打点

- css内联避免页面闪动

可以减少HTTP网络请求次数

raw-loader 内联html(片段)，js

style-loader css

html-inline-css-webpack-plugin



#### 热更新HMR

webpack-dev-server

- 不刷新浏览器
- 不输出文件，放在内存中

原理：wds和浏览器之间维护了一个websocket，当本地资源发生变化时，wds会向浏览器推送更新，并附带上构建时的hash，进行一次对比。对比出差异后会向wds发起ajax请求来获取更新内容，浏览器在根据这些信息继续向wds发起请求获取chunk的增量更新。再由HotModulePlugin来完成。



#### 摇树优化Tree-shaking

基于DCE Dead Code Elimination 死码消除

一个模块可能有多个方法，只要其中一个方法使用到了，整个文件都会被打到bundle里去，tree shaking就是静态分析，标记要擦除的代码，只把用到的方法打入bundle，没用的方法会在uglify阶段被擦除掉

- 代码不可到达
- 代码执行的结果不会被用到

- 只写不读

利用了ES6模块的特点



#### Source map

将编译打包压缩的代码映射回源码

开发时开启，生产关闭

devtool：'source-map'



#### Scope hoisting

构建后的代码存在大量闭包代码，导致打包体积增大，内存开销变大

模块转化

- 被webpack转化后的模块会带上一层包裹
- import，export会被转化成__webpack_require和__webpack_exports

原理：将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量防止变量名冲突

结果：减少函数声明代码，减少内存开销



mode是production自动开启摇树优化和scope hoisting



#### 提取公共资源

基础库，功能模块都是同样的

比如：框架的基础包通过cdn引入，不打入bundle

方法：使用html-webpack-externals-plugin

也可以用splitChunkPlugin进行公共脚本分离(webpack4内置)

chunks参数说明

- async异步引入(默认)
- initial 同步引入的库进行分离

- all 所有引入的库进行分离(推荐)



#### 代码分割

大型项目全部打进一个包显然不合理

使用懒加载，按需引入的思想

splitChunks

比如SPA首页会分一个单独的包

适用的场景：

- 抽离相同代码到一个共享块
- 懒加载

- - require.ensure
  - 动态import(需要babel支持)



#### 多进程/多实例并行解析

资源并行解析可选方案

happyPack(不维护了)

原理：每次webpack解析一个模块，HappyPack会将它及它的依赖分配给worker线程，处理好再交给主线程

thread-loader(更快)，写在loader的最前面

原理相同



#### 多进程/多实例并行压缩

parallel-uglify-plugin

uglifyjs-webpack-plugin：不能压缩ES6

terser-webpack-plugin：官方推荐，可以压缩ES6



#### 分包

externals思路是使用cdn ：html-webpack-externals-plugin，缺点是每一个基础库都要找到他们的cdn，会生成很多script标签

dll-plugin 预编译资源模块，将基础包和业务包分别打包成一个文件，用dllReferencePlugin引用(在manifest指定)，在entry和input指定library



#### 缓存

- babel-loader 开启缓存 语法转换缓存
- terser-webpack-plugin 开启缓存 代码压缩阶段开启缓存

- 使用cache-loader  hard-source-webpack-plugin模块缓存



#### 缩小构建目标

尽可能的少构建模块



#### 去除无用CSS

purgecss-webpack-plugin和mini-css-extract-plugin配合使用



#### 动态polyfill

polyfill-service

请求User Agent，下发不同的Polyfill



#### 打包体积监控分析

监控：vscode有个插件叫import cost，对我们引入的模块大小进行实时监测

分析：使用webpack-bundle-analyzer生成bundle的模块组成图，显示每个模块的体积，每次打包完自动打开浏览器，访问8888端口





#### 构建速度分析

##### 初级策略：stats

```javascript
//package.json
"scripts":{
	"build:stats":"webpack --env production --json > stats.json"
}
```

缺点：颗粒度太粗，看不出问题的细节



##### 进阶

speed-measure-webpack-plugin 

- 分析打包总耗时
- 可以看到每个loader和插件执行耗时





#### 文件指纹

文件名的后缀

标识文件是否被修改

- hash - 只要项目文件有更改，像个项目构建的hash就会改
- chunkhash - 不同的entry生成不同的chunkhash (js用这个)

- contenthash - 内容不变就不变(css)

在output的filename设置

```javascript
output:{
	filename:'[name][chunkhash:8].js
}

module:{
	rules:[
    {
    	test:/.png$/,
      use:[{
      	loader:'file-loader',
        options:{
        	name:'img/[name][hash:8].[ext]'
        }
      }]
    }
  ]
},
  
plugins:[
	new MiniCssExtractPlugin({
  	filename:'[name][contenthash:8].css'
  })

]
```



#### Chunk和Bundle

Chunk：打包过程中一堆module的集合

Bundle：打包最终输出的打包文件。





### 体积优化策略总结

Scope hoisting

tree-shaking

公共资源分离

图片压缩

动态Polyfill

### 

### 源码分析

1. webpack命令的实质：找到webpack/bin 执行bin这个命令 ./bin/webpack.js
2. ...
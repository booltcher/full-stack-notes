## Vue.use(plugin)

1. 参数 Object或者Function
2. 如果参数是对象，调用对象上的install方法；如果参数是函数，就当做install调用

1. 1. install里做的事一般就是保存选项
   2. 通过Vue.mixin()为每一个实例添加一些属性

1. 1. 注册全局组件等

1. 插件只能被安装一次



## Vue.extend()

继承Vue，创建一个子类，拥有和Vue基类拥有一样的能力，并在实例化时会执行继承来的_init方法完成组件的初始化，(返回值是一个构造函数)

参数：接收一个组件对象

源码：**src/core/global-api/extend.js**



1. 在element-ui源码中看到，命令式调用的那些组件，都要先用Vue.extend()，将组件传进去，生成一个组件的构造函数。
2. 实例化的方法里，new Ctor()，将实例手动挂载，得到$el真实dom，并appendChild添加到body上





## Vue.nextTick(cb,ctx)

在下次DOM更新后，执行回调，一般我们修改完数据，想立马获取到更新后的DOM，则使用这个方法。

内部维护了一个callbacks模拟事件队列，将cb放入，并在下一次DOM更新后调用一个flushCallback

底层核心是一个timerFunc

在p.then()里调用flushCallbacks这个方法

内部polyfill -》 Promise - mutationOberver - setImmediate - setTimeout





## Vue.set()

为一个响应式的对象添加一个响应式的属性

弥补Vue不能检测到我们往一个对象上去新加一个属性而引起的依赖派发，从而正确的更新视图

还有一个很像的方法，Vue.util.defineReactive()这个可以为一个非响应式的对象设置响应式的属性，很多插件的实现中，install的mixin就是这么用的





## Vue.mixin()

全局混入

一般在业务中不用，主要是写插件或者写库用的多一些



## Vue.compile(template)

将一个模板字符串编译成render函数
### Vue设计思想

- 数据驱动应用
- MVVM模式的践行者



### MVVM框架三要素

- 响应式 - Vue如何监听数据变化
- 模板引擎 - Vue的模板如何编写和解析

- 渲染 - Vue如何将模板转化为HTML





### 模板语法

### computed和watch

computed有缓存，依赖的值没有改变页面不重新渲染，会return一个值

watch：监听一个值，如果发生变化，执行回调函数。默认初始化不会执行，除非加上immediate



### 2.5.0新增声明周期errorCaptured

子孙组件错误时被调用



### 自定义组件使用v-model

子组件里用props接收value



Vue插件两种形态

1.fn

2.object.install

Vue.use() 会调用插件里的install方法

install方法 

第一个入参就是Vue的构造函数，只因为要对这个构造函数进行扩展，不用再import进来Vue了，这样插件打包的时候就可以不打包Vue的包



实现VueRouter

```javascript
import Vue from "vue"
class VueRouter{
  constructor(options){
  	//1.保存路由选项
    this.$options = options
    //这个方法会给一个对象设置一个响应式的值
    Vue.util.defineReactive(this, current, window.location.hash.slice(1) || '/')
    
    //2.监控hash的变化
    window.addEventListener('hashchange', ()=>{
    	this.current = window.location.hash.slice(1)
    })
  }
}
VueRouter.install = function(_Vue){
	Vue = _Vue
	//1.实现$router，每个实例都能访问到
	//Vue.prototype.$router = router(需要延迟执行，方法调用的时候没有实例化，延迟到router实例和vue实例都创建完毕)
	//使用混入：Vue.mixin({})
  Vue.mixin({
  	beforeCreate(){
      if(this.$options.router){ //如果存在说明当前是根实例 $options可以得到组件的配置
      	Vue.prototype.$router = this.$options.router
      }
    }
  })
  
  //2.实现两个全局组件router-view和router-link
  Vue.component('router-link', {
    props:{
    	 to:{
       	type: String,
        required: true
       }
    },
    // h函数返回的是vdom
  	render(h) {
    	return h('a', {
      	attrs: {
        	href: "#" + this.to
        }
      }, this.$slots.default)
    }
  })
  Vue.component('router-view', {
  
  	render(h) {
      let component = null
    	//1.获取当前url的hash部分
      //2.根据hash部分从路由表中获取对应的组件
      const route = this.$router.$options.routes.find( route => routes.path === this.$router.current)
      if(route) {
      	component = route.component
      }
      return h(component)
    }
  })
}

export default VueRouter
```



### Vuex 

集中式状态管理(登录状态，余额等等)

以可预测的方式变化(单项数据流)



1.实现Store类

- 维持一个响应式状态state
- 实现commit()

- 实现dipatch()
- getters

2.挂载$store

```javascript
let Vue

class Store{
	constructor(options){
  	//1.保存选项
    this._mutations = options.mustations
    this._actions = options.actions
    //2.暴露state,并对传入的state选项做响应式处理
    //Vue.util.defineReactive(this, 'state', this.$options.state)
    this._vm = new Vue({
    	data(){
      	return {
        	$$state: options.state
        }
      }
    })
  }
  
  get state(){
    return this._vm._data.$$state
  }
  set state(){
    console.error('no')
  }
  
  this.commit = this.commit.bind(this)
	this.dispatch = this.dispatch.bind(this)
    
  commit(type, payload){
    const entry = this._mutations[type]
    if(!entry){
      console.error('unknown mutation')
      return
    }
    entry(this.state, payload)
  }

  dispatch(type, payload){
    const entry = this._actions[type]
    if(!entry){
      console.error('unknown actions')
      return
    }
    entry(this, payload)
  }
}

function install (_Vue){
	Vue = _Vue
  Vue.mixin({
  	beforeCreate(){
      if(this.$options.store){
      	Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
```



### 实现响应式

vue2: Object.defineProperty()

vue3: Proxy

```javascript
//设置obj的key，拦截它，初始值val
function defineReactive(obj, key, val){
	Object.defineProperty(obj, key, {
  	get(){
    	return val
    },
    set(){
    	if(v !== val){
       	val = v
        // update()
      }
    }
  })
}
```





每一个属性对应一个Dep实例

一个Dep可能对应多个Watcher

每一个动态的属性对应一个Watcher(vue1.0)

数据变化 -> Dep检测到更新 -> 通知Dep内deps里的所有Watcher -> Watcher执行自己的更新函数

```javascript
//负责具体更新任务的Watcher, 在编译的时候，每发现一个动态属性，创建一个Watcher，每个Watcher精确知道是哪个节点更新
class Watcher{ //订阅者
	constructor(vm, key, updateFn){
  	this.vm = vm
    this.key = key
    this.updateFn = updateFn
    
    //触发依赖收集
  }
  
  update(){
  	this.updateFn.call(this.vm, this.vm[this.key])
  }
}


//和data中的响应式的key是一一对应关系，每次调用defineReactive一次，就要创建一个Dep
class Dep{ //发布者
	constructor(vm, key, updateFn){
    //保存关联的Watcher实例
  	this.deps = []
    this.key = key
    this.updateFn = updateFn
  }
  //添加依赖
  addDep(){
  	this.deps.push(dep)
  }
  //通知
  notify(){
  	this.deps.forEach(dep => dep.)
  }
}
```

调试源码：package.json dev 后添加 `--sourcemap` 重新run dev 会生成一个vue.js.map 源码的影射

#### entry-runtime-with-compiler.js 

- 源码打包的入口文件
- 拓展$mount



#### src/platforms/web/runtime/index.js

- 安装一个平台特有patch函数，patch作用是将vdom转换为dom

- - init，完整创建
  - update，diff oldvnode和vnode

- 实现挂载方法



#### src/core/index.js

- 初始化所有全局API：Vue.component/directive/set/delete/use...



#### src/core/instance/index.js

- 声明Vue，调用初始化方法



#### src/core/instance/init.js

- 初始化Vue

- - 合并系统选项和用户选项
  - `initLifecycle` 初始化$parent ,$root,$children,$refs等实例属性

- - `initEvents` 初始化_events自定义事件
  - `initRender` 插槽$slots $scopeSlots _c $createElement

- - `callHook` beforeCreate(接下来都是状态处理)
  - `initInjections` 处理provide/inject,从父辈继承数据

- - `initState` 处理自己的数据props/methods /data/computed/watch 对组件状态响应式处理，创建响应式属性的Dep并进行依赖收集
  - `initProvide` 传递给后代数据

- - `callHook`created
  - 判断如果选项里有el，自动挂载

- 挂载的时候

- - 声明组件更新函数
  - 创建组件的渲染Watcher实例



#### src/core/instance/lifecycle.js挂载

- updateComponet

- - 先执行render -> vdom
  - 再执行patch -> vdom - > dom 

- new Watcher 一个组件一个Watcher



### 响应式处理细节

props

methods

data



先判断是否有data如果没有设置空对象 如果有data选项 调用initData

initData

- 判断data是不是函数 是就调用函数  不是就直接用
- 重命名判断处理

- 响应式处理



observe() 返回一个Observer实例

如果已经是响应式对象，则无需创建Ob实例直接返回Ob

没有的话就创建Ob

在Ob的构造函数中

new Dep() ？ 这个Dep干什么的？ this.$set(this.obj, 'bar', 'bar') 负责对象变更通知(新增删除属性，数组7个操作)



循环对象的key 调用 `defineReactive` 

如果value是对象，就递归处理

每一个对象都有一个Observer实例与之对应，每一个Ob伴生一个Dep

子Ob也要和当前组件watcher建立关系



如果是数组，内部所有项都要响应式处理 

备份数组的原型对象，并对备份的结果做七个数组方法的覆盖

最后改变数组的原型指向修改好的新对象









Event loop：浏览器为了协调事件处理，脚本执行，网络请求和渲染等任务而制定的工作机制

宏任务Task：浏览器完成一个宏任务，在下一个宏任务执行开始前，会对页面进行重新渲染。

微任务MicroTask：如果存在微任务，浏览器会清空微任务之后再重新渲染，在处理微任务的回调时新生成的微任务回调也会一并处理。



微任务优先级高于下一次宏任务

一开始，整个script会被当做一个宏任务放进执行栈处理





notify()

1. 循环内部所有watcher实例  执行他们的update()
2. update()

1. queueWatcher(this) 会维护一个队列queue，放入的是当前批次需要更新的watcher实例，先去重，判断队列里是否存在当前watcher的id，所以每个watcher只能进入queue一次，不管多少个key变化，只执行一次组件更新，放入的是当前批次需要更新的watcher实例
2. flushSchedulerQueue这个方法就是遍历queue，让每一个watcher执行watcher.run()

1. 通过nextTick(flushSchedulerQueue)，将传入的flushSchedulerQueue放入callbacks中

1. 1. nextTick核心就是timerFunc()
   2. p.then()，根据当前平台支持性，选择某种异步方案

- - - 首选方案：Promise，创建Promise实例，用then方法启动flushCallbacks
    - 次选mutationObserver

- - - 再次选setImmediate和setTimeout

1. flushCallbacks遍历执行callbacks中所有函数
2. 遍历到flushSchedulerQueue时，就会遍历执行queue，执行里面所有watcher的更新函数

1. watcher.run() - > watcher.get() - >watcher.getter() - > updateComponent()(在挂载时候生成的渲染函数)
2. 实例的render()得到vdom

1. update(vdom)
2. patch(oldvdom, vdom)



$nextTick就是将一个函数放进callbacks数组中，再用一个异步方法清空callbacks数组



#### 虚拟DOM

是用JS对象抽象表示DOM，能够描述DOM的结构和关系，状态变化是作用于虚拟DOM，最终映射到DOM上。

为什么用虚拟DOM？

1. 减少操作DOM的次数
2. 精确定位到需要更新的DOM，实现定点更新而不是全量更新

vue中的实现不是从0开始的，借助了第三方库snabbdom



在vue1.0中，是有细粒度的数据变化侦测的，一个key是一个watcher，这时是不需要虚拟DOM的，但是细粒度造成了大量开销，这对于大型项目来说是不可取的，所以vue1.0也被戏称“玩具框架”。所以vue2中选择了中等粒度解决方案，每一个组件一个watcher，这样状态变化只能通知到组件，这时使用虚拟DOM去进行比对和渲染，从而最小限度更新DOM。所以这是vue框架在进化和升级的必然结果。



而且：虚拟DOM可以增强操作的兼容性，跨平台，轻量，最小限度更新DOM



#### patch()

首次在哪被安装？web平台独有配置

patch函数是被一个工厂函数createPatchFn生成的



#### diff

- 同层比较
- 深度优先



首先进行树级别比较：

- new VNode不存在就删
- old VNode不存在就增

- 都存在就进行diff更新(属性更新，文本更新，子节点更新)



具体规则：

1. 有children就先对子节点进行diff操作，调用updateChildren：重排
2. 如果新节点有子节点，而老节点没有，则先清空老节点的文本内容，为其新增子节点：批量创建

1. 如果新节点没有子节点，老节点有，则移除该节点的所有子节点：批量删除
2. 都没有子节点，只是文本的替换：文本更新



#### updateChildren重排方式：

判断tag相同key相同

双指针双向查询

新开头 新结尾 老开头 老结尾 循环

1. 先查看四种情况，首首相同，尾尾相同，首尾相同，尾首相同，找到相同就向下递归
2. 如果没有首尾的相同情况，就老老实实查找

1. 1. 不存在就创建
   2. 相同节点更新

1. 1. 不同节点替换

1. 如果游标重合

1. 1. 老数组先结束，新数组还有剩余吗？批量创建
   2. 新数组先结束，老数组还有剩余吗？批量删除



#### key的作用

- 判断是否是相同vnode



### 组件化

#### 组件注册

- 全局Vue.component()

- - Vue.extend将组件定义转换为构造函数
  - 给全局选项components中加入组件定义

- 组件内部通过components选项





#### 组件实例化



调用_c 

-> createElement 

-> _creatElement 

-> 判断是否是保留标签，如果是就直接创建

-> 如果不是，获取自定义组件的构造函数(从$options.components.xxx)

-> 调用createComponent



#### 组件渲染更新
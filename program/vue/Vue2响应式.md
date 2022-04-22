简单的说就是通过Object.defineProperty()这个属性，对实例的属性进行拦截，为每个属性设置set和get，在这些属性被访问和操作时，触发这两个方法，再配合发布订阅模式，实现对组件的局部更新。



从源码的角度详细描述这个过程(new Vue()后都发生了什么)：

1. 合并系统选项和用户选项
2. 初始化组件的关系 - `initLifecycle` : 初始化组件的$parent,$children,$refs,$root等属性

1. 初始化事件 - `initEvents` : 一些自定义事件，$on,$off
2. 初始化渲染 - `initRender` 插槽$slots $scopeSlots _c $createElement

1. `callHook` beforeCreate(接下来都是状态处理)
2. `initInjections` 处理provide/inject,从父辈继承数据

1. `initState` 处理自己的数据props/methods /data/computed/watch 对组件状态响应式处理，创建响应式属性的Dep并进行依赖收集
2. `initProvide` 传递给后代数据

1. `callHook`created
2. 判断如果选项里有el，自动挂载



其中在initState对组件的属性进行初始化时，对data初始化的方法叫initData

这个方法主要是做了两件事：

- 代理： proxy()方法，实现了我们在通过this.xxx访问data里的属性时，代理到this._data上
- 响应式处理：遍历属性，调用observe()



#### observe()

observe()方法的核心是new一个Observer对象，用来表示响应式后的属性

Observer构造函数中，new实例化了一个Dep，

Observer对象主要有两个属性，第一个是value，存储属性的值；另一个是dep，描述这个响应式的值对应的Dep对象；

Observer对象有一个核心方法walk是循环对象的key调用defineReactive()，如果value还是一个对象就递归进行，对深层数据也调用defineReactive()



#### defineReactive()

我们说的最多的Object.defineProperty()就是在这里工作的

每个值被访问时，触发getter，调用定义好的get()，将当前dep与当前的Watcher()绑定

每个值被设置时，触发setter，调用定义好的set()，调用dep.notify()通知在get时收集到的Watcher()



#### notify()

循环收集的Watcher，将它们放进一个队列queue，定义了一个方法flushSchedulerQueue，这个方法用来调每个Watcher的更新函数，再通过nextTick()包装这个方法，异步清空这个队列。



每个Watcher有对应组件实例的_updateComponent方法，生成一个渲染函数，这个渲染函数返回更新后的虚拟DOM

再patch()，通过diff算法精确定位到每一个组件需要更新的节点。



简而言之：

每一个响应式的值对应一个Dep

每一个组件对应一个Watcher

访问值时，收集当前的Watcher；修改值时，通知之前收集的Watcher更新

每个Watcher都有对应的组件实例的更新函数，生成虚拟DOM，再patch()更新DOM。



刚刚说的每一个组件对应一个Watcher，其实是Vue2对比Vue1的更新，

在vue1中，是每一个响应式的值对应一个Watcher，所以直接可以精确到定位到需要更新的节点，这是一个细粒度的处理方式，但是一个值一个Watcher会造成大量的开销，这使得vue1曾经被人称为“玩具框架”，不能用来做大项目。

vue2采用了中等粒度，每一个组件对应一个Watcher，大大提高了性能，但是没有办法去精确定位到节点，如果直接去更新一个组件就是全量更新，这也会降低性能，增加了很多不必要的DOM操作，所以虚拟DOM和diff算法的出现就是为了实现精确定位到节点的更新，先比对，筛选出更新的节点，再去做更新处理。所以说vue2引入了虚拟DOM是一个必然结果。虚拟DOM这个技术也不是vue专属的，vue的虚拟DOM技术也不是自己从0实现的，是借用了snabbdom这个第三方库，对库做了一些修改。
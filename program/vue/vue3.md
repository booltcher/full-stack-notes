# vue3

- 更快

- - 虚拟DOM重写
  - 优化slots的生成

- - 静态树提升
  - 静态属性提升，标记静态节点尽量不去执行更新

- - 基于Proxy的响应式系统

- 更小：通过摇树优化核心库体积
- 更易维护： ts + 模块化

- 更加友好

- - 跨平台使用

- 更容易使用

- - ts支持
  - 更好的调试支持

- - 独立的响应化模块
  - Composition API



### Vite

贼快

不需要打包，需要什么资源就按需引入



### 新特性

#### composition API

更好的逻辑复用和代码组织。替换mixin等。

#### ref

- 单值响应式处理
- DOM的引用

- value访问值

#### reactive

- 参数只能是对象
- 取值不需要加value

#### toRef

- 对象响应式处理
- toRef和对象保持引用

- toRef用于非响应式对象，产出的结果不具备响应式



#### Teleport

传送门提供一种简洁的方式可以指定它里面内容的父元素。

通过to属性设置选择器



#### Fragments

vue3组件可以拥有多个根。

```
<template>
	<header></header>
  <main></main>
  <footer></footer>
</template>
```



#### Emits

vue3组件发送的自定义事件需要在emits选项中定义



#### custom renderer



#### watchEffect

- 不需要手动传入依赖
- 会先执行一次用来自动收集依赖

- 无法获取到变化前的值，只能获取变化后的值



### 变化

- $attrs包含class和style
- 自定义指令生命周期更改

- mixin 行为修改 浅层合并
- 全局API，vue3有了app的概念

- 摇树优化 因此 全局API，transition，h等现在只能作为ES模块构建的命名导出进行访问

- - nextTick
  - obervable 用reactive替换

- - set
  - delete

- - version

- 推荐条件渲染不再手写key，且使用template的条件渲染可以给template加key
- transition的class名更改from enter

- v-if的优先级高于v-for
- @vnode-代替@hooks



### 移除

- $children 可以使用$refs
- $on $off $once 可以使用第三方库mitt

- filter 选项
- 键码修饰符

- $listeners 移除，放进了$attrs
- .native被去除，使用emites



vue3中响应式基于Proxy对象实现，取缔了Object.defineProperty()

优势：

- 可以直接监听对象而非属性，所以可以监听到属性的添加和删除
- 可以直接监听数组，数组长度变更，索引变更

- 多达13中拦截方式
- 支持Map，Set，weakSet，weakMap

- 返回一个新对象，只操作新对象达到目的
- 性能红利

劣势：较Object.defineProperty()，兼容性差。
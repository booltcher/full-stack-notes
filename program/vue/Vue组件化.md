#### what 什么是组件化

将一个复杂系统根据业务和功能拆分为一个个独立的模块，分离每个模块的责任和边界。

组件可以分为页面组件，业务组件，功能组件



#### why 为什么使用组件化

- 不使用组件化，系统呈现的状态往往是“牵一发而动全身”
- 便于协同开发

- 利于升级和维护
- 提高代码的复用性

- 提高性能，渲染性能 ， 依赖收集系统定位到组件上(组件在$mount时，生成Watcher，绑定当前组件的更新函数)



#### how 怎么实现组件化

源码

##### src/core/global-api/assets.js

步骤

- 注册(定义) 

- - 全局注册Vue.component()，将用户传入的组件配置对象传入Vue.extend()，生成组件的构造函数，并且为每一个Vue实例合并添加components属性
  - 内部注册components选项，单文件组件，vue-loader会编译template为render函数，最终导出的依然是组件配置对象

- 引入
- 交互



#### 组件技术三要素

属性，事件，插槽



#### 组件通信

1. props和$emit
2. $children $ref $parent

1. provide inject
2. eventBus

1. Vuex
2. $attr $listeners

1. 插槽



#### 组件划分原则

- 高内聚低耦合
- 单向数据流
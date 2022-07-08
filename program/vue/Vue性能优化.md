# Vue性能优化

- 路由懒加载

```
const router = new VueRouter({
	routes:[{
  	path:'foo', component:() => import ('./Foo.vue')
  }]
})
```

- keep-alive缓存

- - include
  - exclude

- 使用v-show而不是v-if复用DOM
- v-for遍历不用v-if

- 长列表性能优化

- - 纯粹展示，不会有改变，就不需要响应化

- - - 定义在外部
    - 使用Object.freeze()

- - 虚拟滚动，只渲染少部分区域的内容

- 事件的销毁：vue组件销毁时，自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件
- 图片懒加载vue-lazyload

- 第三方插件按需引入

- - element-ui: babel-plugin-component
  - vant: babel-plugin-import

- 无状态的组件标记为函数式组件 template上加functional 没有组件实例
- 子组件分割

- 变量本地化 不要频繁使用this.xxx
- SSR(首屏加载快，SEO友好)



#### 基于Webpack

- 静态资源压缩
- 提取公共代码





#### 基于Web技术的优化

- 开启gzip压缩
- 浏览器缓存

- cdn
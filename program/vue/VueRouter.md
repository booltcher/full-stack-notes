# VueRouter

路由传参：

- query和path，params和name
- params是路由的一部分，query是url后面的参数

### 插件

- install方法

- - Vue.mixin()在每一个Vue实例的beforeCreate生命周期混入两个描述路由信息的属性，$route和$router，并把$route定义为一个响应式属性

- 全局注册两个组件router-view，router-link



### 如何监听路由变化

- hash模式：hashchange

- - 前进后退
  - a标签改变URL

- - window.location改变URL

- history模式：popstate

- - 前进后退
  - pushState/replaceState

- - history的go，back，forword方法



### $router和$route

- $router就是我们new VueRouter()得到的那个实例对象
- $route表示当前激活路由的信息，包括当前URL解析得到的信息，路径，参数等等



```
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
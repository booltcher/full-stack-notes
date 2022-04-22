# Vuex刷新

#### 为什么刷新数据会丢失？

vuex的store中的数据是保存在运行内存中的，页面刷新时，会重新加载vue实例，所以vuex里面的数据就会被重新赋值



#### 如何解决？

**1.****sessionStorage**

刷新的时候，将state的值存到sessionStorage中，然后从sessionStorage中获取，在赋值给state，并移除sessionStorage。

app.vue中

缺点：只能存储字符串数据，对于对象类型要先JSON.stringify()转为字符串

```
 created() {
    window.addEventListener('beforeunload',()=>{
       sessionStorage.setItem('list', JSON.stringify(this.$store.state))
    })
    
    try{
      sessionStorage.getItem('list') && this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem('list'))))
    }catch(err) {
      console.log(err);
    }
  
    sessionStorage.removeItem("list");
  }
```

**2.使用插件vuex-persistedstate**

```
1. npm install vuex-persistedstate -S //安装插件
2. 在 store/index.js 文件中添加以下代码：
import persistedState from 'vuex-persistedstate'
const store = new Vuex.Store({
 state:{},
 getters:{},
 ...
 plugins: [persistedState()] //添加插件
})
//默认使用localStorage存储
//如果要改为sessionStorage，设置storage属性为window.storage
plugins: [
    persistedState({ storage: window.sessionStorage })
]
```
为什么不用iFrame？

iframe硬隔离，产生的隔离无法被突破，导致应用间上下文无法被共享，随之带来的开发体验和应用体验的问题。

1. url不同步，浏览器刷新iframe url状态丢失，后退前进按钮失效
2. UI不同步，DOM结构不共享

1. 全局上下文完全隔离，内部变量不共享
2. 慢：每次进入子应用都是一次浏览器上下文重建，资源加载的过程。



有的问题好解决(1)，有的问题我们可以睁一只眼闭一只眼(4)，有的问题很难解决(3)，甚至有的问题无法结局(2)



为什么微前端有价值？

- 技术栈无关
- 独立开发，独立部署，独立运行

- 增量升级



主应用：状态管理(登录)，导航，标签栏，当然还可以包含一些业务功能

子应用：根据主应用路由和导航动态加载



#### 安装

```javascript
npm i qiankun -S
```

#### 在主应用注册微应用

qiankun 暴露三个方法，注册微应用，全局错误监听，启动微应用

- name定义微应用的name(唯一)
- entry入口地址

- container容器节点选择器
- activeRule微应用的激活规则 （支持直接配置字符串或字符串数组，当配置为字符串时会直接跟 url 中的路径部分做前缀匹配，匹配成功表明当前应用会被激活。）

```javascript
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/yourActiveRule',
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);

start();
```

注册完后，一旦浏览器的url发生变化，变会自动触发qiankun的匹配逻辑，所有activeRule规则匹配上的微应用就会被插入到指定的container中，同时依次调用微应用暴露出的生命周期钩子。



#### 手动加载微应用

loadMicroApp



#### 微应用使用

在入口js，暴露生命周期

```javascript
export async function bootstrap(){}
export async function mount(props){
	render(props)
}
export async function unmount(){}
export async function update(){}
```





#### 通信

initGlobalState 初始化state

state变化触发 onGlobalStateChange



微应用通过props获取
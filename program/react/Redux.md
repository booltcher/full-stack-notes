[TOC]

## Redux是什么

是一个状态容器，提供可预测化的状态管理。保证程序行为一致性且易于测试。



## 什么场景适合用Redux

- 项目有相当大量的、随时变化的数据
- state需要一个单一可靠的数据来源
- 把所有state放在最顶层的组件中已经无法满足需要了
- 某个组件的状态需要共享



## 用法

### 安装

```bash
npm install redux --save
npm install react-redux --save
```



### 创建容器和修改规则

```js
import { createStore } from "redux";

const counterReducer = (state=0, action) => {
    // 处理逻辑
    return state + 1;
}

const store = createStore(counterReducer);
export default store
```



### 使用

```js
import store from "store.js";

// store.subscribe()
// store.dispatch()
```



### React-redux




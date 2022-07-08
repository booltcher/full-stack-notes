[TOC] 
### 组件跨层级传递

#### 什么时候使用context

- 很多层级需要共享
- 一旦更新，子组件都需要更新

  

### 用法
#### 创建context

```js
export const Context = React.createContext()
```

#### 创建Provider，传递value
Provider可以多层嵌套，子组件在获取的时候，如果有重复的value，会采用就近原则

```html
<Context.Provider value={ theme }></Context.Provider>
```

#### 子组件消费
1. 类组件 `contentType`，只能订阅单一的context来源，多个的话会被之后的覆盖

```js
 <Context.Provider value={ theme }>
     <Child></Child>
 </Context.Provider>

 // Child
 static contentType = Context;
 const { theme } = this.context
```

2. 函数式组件或自定义hook `useContext`

```js
 const theme = useContext(Context)
```

3. 不限制类组件或函数式组件`consumer`，不过订阅多个Provider时需要多层嵌套

```js
 <Context.Consumer>
     <Context2.Consumer>
         <Context3.Consumer>
         </Context3.Consumer>
     </Context2.Consumer>
 </Context.Consumer>
```

**总结：**当要传递的值是一个对象时，提取出去，不要使用内联的形式。
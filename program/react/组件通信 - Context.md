[TOC]
### 什么时候使用Context

- 很多层级需要共享
- 一旦更新，子组件都需要更新，所以如果一个`Context`的树过于庞大，则需要慎用。

  

### 用法


#### 创建context

```js
export const ThemeContext = React.createContext()
```



#### 创建Provider，传递value

`Provider`可以多层嵌套，子组件在获取的时候，如果有重复的value，会采用就近原则。是一个逻辑组件，不会渲染到真实的DOM中。

```html
<Context.Provider value={ theme }></Context.Provider>
```



#### 子组件消费

#####  `contentType`

只能在类组件中使用，只能订阅单一的context来源，多个的话会被之后的覆盖

```js
 <Context.Provider value={ theme }>
     <Child></Child>
 </Context.Provider>

 // Child
 static contentType = ThemeContext;
 const { theme } = this.context
```



##### `useContext`

只能用在函数式组件或自定义hook中

```js
 const theme = useContext(ThemeContext)
```



##### `Consumer`

不限制类组件或函数式组件，不过订阅多个Provider时需要多层嵌套

```js
 <ThemeContext.Consumer>
     <Context2.Consumer>
         <Context3.Consumer>
     		{ theme => (<div>{theme}</div>)}
         </Context3.Consumer>
     </Context2.Consumer>
 </ThemeContext.Consumer>
```

#### 注意事项

当`Provider`要传递的值是一个对象时，如果写成下面的方式，那么每次`Provider`的父组件重新渲染时，判断每一个子组件是否需要diff(依据就是子组件的props是否有更新)，而`value`是对象的话则到导致每次都判定为需要更新，从而每次都会引起`Provider`的重新渲染，这样会同时更新所以的`Consumer`。

```js
<Provider value={{data: "123"}}>
    <Consumer />
</Provider>
```

所以应该将`value`提取为变量，而不应该使用内联的方式。

```js
this.state = {
	value: {data: '123'},
};

<Provider value={this.state.value}>
    <Consumer />
</Provider>
```


### var

1. **用var关键字的变量声明会被提升-声明提升，在全局作用域用var声明的变量会被挂载到全局对象上，在浏览器环境是window，在node环境是global**

什么是声明提升

```javascript
var a = 10
var a
console.log(a)

// -> 等价于

var a
var a
a = 10
console.log(a)
```

为什么会有声明提升的机制：为了解决函数互相调用的问题

```javascript
function a(){
	b()
}
function b(){
	a()
}
```

1. **用var可以重复声明变量**
2. **无块级作用域（****在let和const出现之前，JavaScript只有全局作用域和函数作用域****）**

- ES5只有全局作用域和函数作用域，没有块级作用域。
- 无块级作用域带来的问题：内层变量污染全局变量；循环的计数变量泄露为全局变量

```javascript
for(var i=0;i<5;i++){
  setTimeout(()=>{
    console.log(i)
  })
}
// 5次5
// 方法1:let
for(let i=0;i<5;i++){
  setTimeout(()=>{
    console.log(i)
  })
}
// 方法2:闭包
for (var i = 0; i < 5; i++) {
  (function (j) {
    setTimeout(() => {
      console.log(j)
    })
  })(i)
}
// 方法3:使用定时器的第三个参数
for (var i = 0; i < 5; i++) {
  setTimeout((i) => {
    console.log(i)
  },0,i)
}
// 0
// 1
// 2
// 3
// 4
```

### let 

- 无声明提升
- 有块级作用域

- 暂时性死区

```javascript
var tmp = 123;
if (true) {
  tmp = 'abc'; // 报错 因为本区域有tmp声明变量
  let tmp; // 绑定if这个块级的作用域 不能出现tmp变量
}
//Uncaught ReferenceError: Cannot access 'tmp' before initialization
//在编译的时候识别当前块级作用域有tmp变量，但是访问受到限制
```





### const

- 声明的时候必须赋值
- 变量所指向的内存地址不能发生变化

- 全局的let/const不会修改window对象，而是将变量的声明放在了一个特殊的对象下，比如[[Scope]]
### call



```javascript
  Function.prototype.myCall = function (context) {
    //判断传入的this指向值是否为空，context其实就是obj
    context = context || window;

    //我们命名一个独一无二的属性名，避免重名导致覆盖
    let fn = Symbol('fn');

    //这里的this其实就是函数foo，我们把它作为传入的context对象的属性进行调用，这样就可以利用隐式绑定的规则设置this
    context[fn] = this

    //去除掉传入的context值，剩下的就是参数了
    const args = [...arguments].slice(1);

    //执行函数并返回结果
    const result = context.fn(...args);

    //删除这个属性值，销毁犯罪现场
    delete context.fn;

    return result;
  }
```



### apply

```javascript
  Function.prototype.myApply = function (context, args) {
    //判断传入的this指向值是否为空，context其实就是obj
    context = context || window;

    //我们命名一个独一无二的属性名，避免重名导致覆盖
    let fn = Symbol('fn')

    //这里的this其实就是函数foo，我们把它作为传入的context对象的属性进行调用，这样就可以利用隐式绑定的规则设置this
    context[fn] = this

    //执行函数并返回结果，...可以把数组中的参数展开
    const result = context[fn](...args);

    //删除这个属性值，销毁犯罪现场
    delete context.fn;

    return result;
  }
```





### bind

创建一个新的函数

```javascript
Function.prototype.myBind = function (context, ...args) {
    //同样是为了拿到调用bind的函数本身，如foo
    const fn = this

    //对参数做个空处理
    args = args ? args : []

    //bind会返回一个闭包函数，保存传入的context和参数
    return function newFn(...newFnArgs) {
      //对new操作和bind组合的情况，做处理，把this让给new
      if (this instanceof newFn) {
        return new fn(...args, ...newFnArgs)
      }

      //否则直接通过apply显示绑定context目标
      return fn.apply(context, [...args, ...newFnArgs])
    }
  }
```


## apply

```js

Function.prototype.myApply = function (context, args) {
    //判断传入的this指向值是否为空，context其实就是obj
    context = context || window;

    //我们命名一个独一无二的属性名，避免重名导致覆盖
    let fn = new Symbol('fn')

    //这里的this其实就是函数foo，我们把它作为传入的context对象的属性进行调用，这样就可以利用隐式绑定的规则设置this
    context[fn] = this

    //执行函数并返回结果，...可以把数组中的参数展开
    const result = context[fn](...args);

    //删除这个属性值，销毁犯罪现场
    delete context.fn;

    return result;
  }
```



## bind

```js
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





## new

```js
function Person(name, age) {
    this.name = name
    this.age = age
    return {
       
    }
}

Person.prototype.hello = function () {
    console.log('hello, my name is ' + this.name)
}

let person = new Person('Tom', 18);
console.log(person)
person.hello()  //hello, my name is Tom


//自己实现的new
function myNew(func, ...args) {
    //1.创建空对象
    const obj = {}
    //2.执行构造方法
    const result = func.call(obj, ...args)
    //3.设置原型链
    obj.__proto__ = func.prototype
    //4.如果构造函数有Object类型的返回值(Function, Array, Date, RegExp, Error)，需要将结果返回；
    isObject = typeof result === 'object' && result !== null;
    isFunction = typeof result === 'function';
    if (isObject || isFunction) {
        return result
    }
    //4.如果构造函数没有有Object类型的返回值，返回我们的新对象
    return obj
}

let myPerson = myNew(Person, 'Jack', 25)
console.log(myPerson)
myPerson.hello()  //hello, my name is Jack
```


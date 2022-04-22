#### 默认绑定

不带任何修饰符的函数调用时，内部的this就是默认绑定：



- 非严格模式指向`Window`
- 严格模式为`undefined`；

- 如果在非严格模式下定义了函数，又在严格模式下调用，最终`this`的值还是会指向`Window`

------

#### 隐式绑定

如果函数作为某个对象的方法调用时，`this`指向当前这个对象



##### 多层对象属性引用链

`this`指向最近的对象



```javascript
a.b.c.foo()
//等价于
c.foo()
```

------

#### 显式绑定

`call`,`apply`,`bind`，可以传入指定的对象作为`this`的指向



- `call`



```javascript
    var obj = {
      name: "obj",
    };
    function foo() {
      console.log(this.name);	//obj
    }
    foo.call(obj);
```



- `apply`



```javascript
    var obj = {
      name: "obj",
    };
    function foo() {
      console.log(this.name);	//obj
    }
    foo.call(obj);
```



- `call`和`apply`差别，参数罗列和参数数组



```javascript
    var obj = {
      name: "obj",
    };
    function foo(a,b,c) {
      console.log(this.name,a,b,c);	//obj 1 2 3
    }
    foo.call(obj,1,2,3);
    foo.apply(obj,[1,2,3]);
```



- `bind`



```javascript
    function foo(a, b, c) {
      console.log(a, b, c);
    }

    //第一个参数为null时，非严格模式下会以Window对象作为this指向值，后面会介绍
    //给foo函数套了层壳子，并存储了两个参数1,2
    var bindFoo = foo.bind(null, 1, 2);
    //当调用这个包装函数的时候，传入的参数会连同之前存储的参数一起传给foo函数
    bindFoo(3); //1 2 3
```

------

#### 软绑定

```javascript
    Function.prototype.softBind = function (obj) {
      //先拿到调用softBind的函数本身
      var fn = this;

      //这里是为了拿到传入的其他参数，并存储起来
      var curried = [].slice.call(arguments, 1); //arguments是类数组所以没有slice方法

      //这里是返回的包装好的函数
      var bound = function () {
        
        //判断this的情况，这里的this是返回的封装函数执行时的this，和调用softBind函数时的this不同
        var that = (!this || this === (window || global)) ? obj : this; //判断this是否空，同时考虑node环境

        //这里的目的是为了把包装时传入的参数，和执行包装函数时传入的参数进行合并，arguments和之前的arguments不同
        var newArguments = [].concat.apply(curried, arguments);

        //这里其实就是调用函数
        return fn.apply(that, newArguments);
      };

      //有一个细节是调整包装好的函数的原型链，使得instanceof能够用于包装好的函数的判断
      bound.prototype = Object.create(fn.prototype);
      return bound;
    };
```

------

#### `new`绑定

`new`会改变`this`的指向于实例



```javascript
function Foo(name){
	this.name=name;
}

let person=new Foo('b');
console.log(person);	//b
```

------

#### 箭头函数绑定

箭头函数中的`this`指向定义的作用域，不会动态更新，function函数的this指向调用的作用域



```javascript
    //定义一个箭头函数
    var foo = () => {
      console.log(this.name);
    };
    var name = "我是全局的name";
    var obj1 = {
      name: "我是obj1的name",
    };

    foo.call(obj1); // "我是全局的name"
```



#### 几种绑定方式的优先级（由低到高）



1. 默认绑定
2. 隐式绑定

1. 显示绑定
2. `new`，箭头函数
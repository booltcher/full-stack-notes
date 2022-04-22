**S.O.L.I.D**是Robert C. Martin提出的前**五个面向对象设计**（**OOD**）原则的首字母缩写

- S - 单一责任原则(Single Responsibility)
- O - 开闭原则(Open-close, open for extension, close for modification)
- L - 里氏替换原则(Liskov Substitution)
- I - 接口隔离原则(Interface Segregation)
- D - 依赖反转原则 (Dependency Inversion)



## 单一职责原则

对象应该具有一种单一功能，类和方法应该只有一个职责

引起类变化的因素不要多于一个

降低各个功能之间的耦合，保证高内聚、低耦合的功能。

:question: 如果一个对象承担了太多职责，可能存在：

- 一个职责的变化可能会影响这个类其他职责的能力
- 当需要修改某个职责时，不得不将其他不需要的职责一起考虑到，从而造成代码冗余或浪费

:bell: 我们设计类时，如果功能因不同原因而发生变化，我们应该尝试将功能分开

:x:

```typescript
class Animal {
    constructor(name: string){ }
    getAnimalName() { }
    saveAnimal(a: Animal) { }
}
```

:heavy_check_mark:

```typescript
class Animal {
    constructor(name: string){ }
    getAnimalName() { }
}
class AnimalDB {
    getAnimal(a: Animal) { }
    saveAnimal(a: Animal) { }
}
```





## 开闭原则

对扩展开放，对修改关闭

一个类或者函数确定其功能后，不能再对其原有能力进行修改，只能在其原有功能上进行扩展新的能力。

:question:会影响原有功能的正常运行，破坏原有的单元测试

:bell:现有接口规范可以通过继承重用

:x:

```typescript
class Animal {
    constructor(name: string){ }
    getAnimalName() { }
}
const animals: Array<Animal> = [
    new Animal('lion'),
    new Animal('mouse')
];
function AnimalSound(a: Array<Animal>) {
    for(int i = 0; i <= a.length; i++) {
        if(a[i].name == 'lion')
            log('roar');
        if(a[i].name == 'mouse')
            log('squeak');
    }
}
AnimalSound(animals);
```

:heavy_check_mark:

```typescript
class Animal {
        makeSound();
        //...
}
class Lion extends Animal {
    makeSound() {
        return 'roar';
    }
}
class Squirrel extends Animal {
    makeSound() {
        return 'squeak';
    }
}
class Snake extends Animal {
    makeSound() {
        return 'hiss';
    }
}
//...
function AnimalSound(a: Array<Animal>) {
    for(int i = 0; i <= a.length; i++) {
        log(a[i].makeSound());
    }
}
AnimalSound(animals);
```





## 里氏替换原则

对象应该是可以在不改变正确性的前提下被它的子类所替换和覆盖

当一个类继承另一个类时，除了添加新的方法外，尽量不要重写或重载父类的方法。否则用基类实现的功能换成子类后就会出现异常。

:question:适用于基类的单元测试不能成功用于子类，类继承会混乱

:bell:尽量不要重写或重载父类的方法

:x:

```typescript
function AnimalLegCount(a: Array<Animal>) {
    for(int i = 0; i <= a.length; i++) {
        if(typeof a[i] == Lion)
            log(LionLegCount(a[i]));
        if(typeof a[i] == Mouse)
            log(MouseLegCount(a[i]));
        if(typeof a[i] == Snake)
            log(SnakeLegCount(a[i]));
    }
}
AnimalLegCount(animals);
```

:heavy_check_mark:

```typescript
function AnimalLegCount(a: Array<Animal>) {
    for(let i = 0; i <= a.length; i++) {
        a[i].LegCount();
    }
}
AnimalLegCount(animals);
```







## 接口隔离原则

客户端不应该被迫依赖于用不到的接口

接口应该仅包含必要的方法，而不应该包含其他的方法

:question:否则每次在接口类中新增一个抽象方法时，必须修改所有子类，可能会实现很多无用方法

:x:

```typescript
interface IShape {
    drawCircle();
    drawSquare();
    drawRectangle();
}
```

:heavy_check_mark:

```typescript
interface IShape {
    draw();
}
interface ICircle {
    drawCircle();
}
interface ISquare {
    drawSquare();
}
interface IRectangle {
    drawRectangle();
}

class Circle implements ICircle {
    drawCircle() {
        //...
    }
}
class Square implements ISquare {
    drawSquare() {
        //...
    }
}
class Rectangle implements IRectangle {
    drawRectangle() {
        //...
    }    
}
```





## 依赖反转原则

- 高层模块不应该依赖具体细节实现模块，两者都应该依赖抽象

- 抽象不应该依赖细节，细节应该依赖抽象

**控制反转：**把对象之间的依赖关系提到外部去管理

**依赖注入：**对象所需要的依赖从外部注入进来、可以是通过对象的构造函数传参注入，这种叫做`构造器注入（Constructor Injection）`。如果是通过`JavaBean`的属性方法传参注入，就叫做`设值方法注入(Setter Injection)`。

:question:变化是有风险的，通过依赖一个抽象而不是一个实现，适当减少了代码之间的耦合

:bell:一般会有一个IoC控制容器来实现依赖注入功能

:x:

```typescript
class Http {
    constructor(private xmlhttpService: XMLHttpService) { }
    get(url: string , options: any) {
        this.xmlhttpService.request(url,'GET');
    }
    post() {
        this.xmlhttpService.request(url,'POST');
    }
    //...
}
```

上面的示例违背了这个原则，高层模块的Http类依赖了低层模块的XMLHttpService类，当我们改变请求的实现时，比如使用NodeJs、Mock服务，我们需要细心地重构上述代码，得不偿失。实际上高层模块的Http类不应该关心具体的的实现细节，接起来，我们进行改造。定义一个请求抽象类Connection类

:heavy_check_mark:

```typescript
interface Connection {
    request(url: string, opts:any);
}
// Http类的参数修改为抽象Connection类
class Http {
    constructor(private httpConnection: Connection) { }
    get(url: string , options: any) {
        this.httpConnection.request(url,'GET');
    }
    post() {
        this.httpConnection.request(url,'POST');
    }
    //...
}
```




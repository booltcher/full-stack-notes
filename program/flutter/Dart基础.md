## 历史

Dart - 是结构化的Web编程语言。属于ECMAScript规范体系。

- 2011年10月，谷歌发布了Dart语言。
- 2013年11月，谷歌发布Dart1.0版本。

- 2018年8月，谷歌发布Dart2.0版本。

- 2018年12月发布Flutter1.0版本。

  

main()函数是Dart中的预定义方法，充当应用程序的入口。Dart脚本需要main()方法来执行。

（vscode插件 Code runner）



### Dart基本数据类型

- 数值 int, double, num
- 字符串 String
- 布尔 bool
- 数组 List
- 字典 Map



### Dart必须使用严格的分号

定义变量：虽然Dart是强类型语言，但是在定义的时候不是必须设置类型，Dart有类型推断机制。

```dart
//自动类型推断，根据赋的值决定类型，并不代表是可更改的类型
var num=1;
const num=1;//常量，不能被重新赋值，必须被赋值

final num;//常量，可以不被立即赋值，但是复制后也不能修改赋值

double num1=2;
```



### 输出调试信息方法

```dart
print(); //只能接受一个参数
```



### 类型转换

```dart
String str1 = "111";
init num1 = int.parse(str1);
```



### 类型获取

```dart
bool isNum = str1 is num;
bool isStr = str1.runtimeType==String;
```



### 字符串

#### 字符串拼接

```dart
String str1 = "Hello";
String str2 = "World";
String str3 = "$str1 $str2";
String str4 = str1 + str2;
```





#### 字符串多行文本

使用三个引号(单双引号都行)

```dart
String text = """Hello
	World
""";
```



### 数组

#### 数组声明

1. 使用`var`，会使用自动类型推断

```dart
var list1 = [1, 2, 3, 4, "5", {value:"1"}]; //推断为List<Object>
```

2. 使用`List`结合泛型严格定义类型

```
List<int> list2 = [1, 2, 3];
```



#### 添加元素

- `add`只能传一个参数
- `addAll`可以传一个数组，用来拼接数组



#### 常用方法

- `indexOf`

- `remove`

- `removeAt`

- `removeLast`删除最后一项

- `removeRange(start, end)` 范围删除

- `removeWhere()` 根据条件删除

- `fillRange(start, end, value)`用value替换start到end的值

- `insert(index, value)`

- `insertAll(index, list)`

- `setAll(index, list)`从index开始，逐个替换list中的元素

- `mylist.toList(growable: false)`生成一个新的数组，growable

- `first, last`

- `join()`

- `split()`

- `map()`

- `reversed`

- `shuffle()` 打乱

- ...

  










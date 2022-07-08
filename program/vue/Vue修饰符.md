# Vue修饰符

#### 表单修饰符

- trim
- number

- lazy(不是实时修改，鼠标离开，触发更新)



#### 事件修饰符

- once
- native 将组件转为普通的HTML标签

- stop
- capture

- prevent
- self，只有事件是从事件绑定的本身触发的才会执行回调

- passive 给scroll事件加上了lazy



#### 鼠标修饰符

- left
- right

- middle



#### 键盘修饰符

- enter
- tab

- delete
- space

- esc
- up

- down
- left

- right



#### 动态属性修饰符

- sync 简化子组件内部修改父组件属性

```
//父组件
<comp :myMessage.sync="bar"></comp> 
//子组件
this.$emit('update:myMessage',params);
```

- camel 将属性名渲染成驼峰
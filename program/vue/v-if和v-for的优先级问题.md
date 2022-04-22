# v-if和v-for的优先级问题

在源码中：

#### src/compiler/codegen/index.js 64行genElement()

在做判断时，v-for是优于v-if

在实际情况中，我们可以打印this.$options.render()模板生成的渲染函数

可以看到是循环内部再判断



通过 `vue-template-compiler` 包编译成render函数

```
const ast = compiler.compile('<div v-if="false" v-for=i in 3"></div>')
console.log(ast.render)
 // with(this){return _l((3),function(i){return (false)?_c('div'):_e()})}
 // 判断当前如果是true 渲染div  如果是false 渲染空标签
 // 先循环 再去判断 所以会造成性能消耗
 // v-if的优先级低于v-for
```



处理方式：

- v-if提取到外层使用template标签
- 使用计算属性，获取真实需要循环的列表数据
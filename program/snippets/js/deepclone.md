1. `JSON.stringify()`

- 会忽略 `undefined`
- 会忽略 `symbol`

- 不能序列化函数
- 不能解决循环引用的对象

- 不能处理函数和正则

1. 万能

```javascript
/**
* @params {source} 源数据
* @returns {*}
* @description 对象深拷贝
*/
function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments')
    }
    const targetObj = Array.isArray(source) ? [] : {}
    Object.keys(source).map(item => {
        if (source[item] && typeof source[item] === 'object') {
            targetObj[item] = deepClone(source[item])
        } else {
            targetObj[item] = source[item]
        }
    })
    return targetObj
}

export default deepClone
```

3.使用MessageChannel

```javascript
function structuralClone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel()
    port2.onmessage = ev => resolve(ev.data)
    port1.postMessage(obj)
  })
}

var obj = {
  a: 1,
  b: {
    c: 2
  }
}

obj.b.d = obj.b

// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
const test = async () => {
  const clone = await structuralClone(obj)
  console.log(clone)
}
test()
```

### 浅拷贝

- 扩展运算符
- Object.assign()
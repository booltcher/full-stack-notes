```js
/*
* @params {Object} source 源数据
* @return result
* @description 对象深冻结
*/
const deepFreeze = (source) => {
  const propNames = Object.getOwnPropertyNames(obj)
  for (const name of propNames) {
    const value =source[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(source);
}
```


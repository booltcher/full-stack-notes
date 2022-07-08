

# hex

```js
const randomHexColorCode = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};


randomHexColorCode(); // "#e34155"
```



## rgb

```js
/*
* @return result 颜色代码
* @description 生成随机颜色代码
*/
function randomColorRgb() {//rgb颜色随机
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var rgb = '(' + r + ',' + g + ',' + b + ')';
    return rgb;
}

export default randomColorRgb
```


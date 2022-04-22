```js
/**
* @params {Date} dateInitial 初始日期
* @params {Date} dateFinal 结束日期
* @return result 相隔天数
* @description 计算两个日期之间相差多少天
*/
function dateGap(dateInitial, dateFinal){
    return (dateFinal - dateInitial) / (1000 * 3600 * 24);
}
export default dateGap


dateGap(new Date('2019-01-01'), new Date('2019-10-14')); // 286
```


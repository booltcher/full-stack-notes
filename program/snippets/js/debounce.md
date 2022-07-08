```js


/*
* @param {Function} func 函数
* @param {Number} wait 延迟执行毫秒数
* @param {Boolean} immediate true 表示立即执行，false 表示非立即执行
* @description 防抖:非立即执行版防抖为n时间后执行一次函数。立即执行版防抖是立即执行一次函数。你尽管触发事件，但是我一定在事件触发的n秒之后才执行，如果你在触发事件n秒内又触发了这个事那我就以新的事件的时间为准，n秒之后在执行。
*/
function debounce(func, wait, immediate) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        typeof func === 'function' && func.apply(context, args)
      }
    } else {
      timeout = setTimeout(() => {
        typeof func === 'function' && func.apply(context, args)
      }, wait)
    }
  }
}
export default debounce

```


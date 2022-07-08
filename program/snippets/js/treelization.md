```js


/**
* @params {Array} items 源数据
* @params {String} link 生成树依据的属性名，默认'parent_id'
* @returns result 树状对象
* @description 依据link属性，将扁平数据转化为树状结构
*/
const arrayTree = (items, id = null, link = 'parent_id') =>
items
.filter(item => item[link] === id)
.map(item => ({ ...item, children: arrayTree(items, item.id) }));﻿


export default arrayTree



/**
 * 递归查找，获取children
 */
const getChildren = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = {...item, children: []};
      result.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
}

/**
* 转换方法
*/
const arrayToTree = (data, pid) => {
  const result = [];
  getChildren(data, result, pid)
  return result;
}



```


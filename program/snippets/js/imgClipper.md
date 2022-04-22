```js
/**
* @params {String} src 图片路径
* @params {String} mode 图片剪裁方式，'default'：保证图片完全显示
* @params {Number} max_width 容器最大宽度，单位px
* @params {Number} max_height 容器最大高度，单位px
* @returns {Object} result 包含剪裁后图片尺寸
* @description 图片剪裁
*/

export async function imgClipper(src, max_width, max_height, mode='default') {
  let height, width;
  let imgResolvePromise = new Promise((resolve) => {
    let img = new Image();
    img.src = src;
    img.onload = function() {
      resolve(img);
    };
  });
  let imgParams = await imgResolvePromise(src)
  let imgRatio = imgParams.width / imgParams.height;
  let containerRatio = max_width / max_height

  if(mode === 'default'){
    if (imgRatio < containerRatio) {
       height = max_height;
       width = max_height * imgRatio
    } else {
      width = containerRatio
      height = containerRatio / imgRatio
    }
  }

  return {
    originHeight: imgParams.height,
    originWidth: imgParams.width,
    height,
    width
  }
}

```


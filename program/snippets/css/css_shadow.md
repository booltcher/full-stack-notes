```css


box-shadow: 0rpx 1rpx 20rpx 2rpx rgba(1, 1, 1, 0.1);﻿

/*阴影*/
._shadow {
    box-shadow: 0 0 20upx 2upx rgba(1, 1, 1, 0.1);
}
._shadow_short {
    box-shadow: 4px 4px 10upx -4upx rgba(1, 1, 1, 0.1);
}

//RGBA转16进制添加透明度
._shadow_color {
    box-shadow: 0px 4px 10px -4px @mainColor;
}

/*内阴影*/
._shadow_inset {
    box-shadow: 0 1px 20upx 2upx rgba(1, 1, 1, 0.1) inset;
}

```


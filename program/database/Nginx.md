## 简介

- 一款轻量级的Web服务器、反向代理服务器
- C语言开发
- 设计思想是事件驱动的异步非阻塞处理（类似node.js)
- 由于它的内存占用少，启动极快，高并发能力强
- 扩展性好，第三方插件多
- 在互联网项目中广泛应用



**用途：反向代理，负载均衡，动静分离**

![img](http://rafs7sum2.hb-bkt.clouddn.com/note-images/v2-e1826bab1d07df8e97d61aa809b94a10_720w.jpg)



### 反向代理

正向代理：

由于防火墙的原因，我们并不能直接访问谷歌，那么我们可以借助VPN来实现，这就是一个简单的正向代理的例子。这里你能够发现，正向代理“代理”的是客户端，而且客户端是知道目标的，而目标是不知道客户端是通过VPN访问的。

当我们在外网访问百度的时候，其实会进行一个转发，代理到内网去，这就是所谓的反向代理，即反向代理“代理”的是服务器端，而且这一个过程对于客户端而言是透明的。

![img](http://rafs7sum2.hb-bkt.clouddn.com/note-images/v2-c8ac111c267ae0745f984e326ef0c47f_720w.jpg)



![img](http://rafs7sum2.hb-bkt.clouddn.com/note-images/v2-4787a512240b238ebf928cd0651e1d99_720w.jpg)





### 负载均衡

![img](http://rafs7sum2.hb-bkt.clouddn.com/note-images/171862efada16376~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 动静分离



![img](http://rafs7sum2.hb-bkt.clouddn.com/note-images/171867d175eae45f~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
























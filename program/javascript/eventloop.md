### JS是单线程

线程vs进程

1. 浏览器新打开一个Tab就是一个新的进程，一个进程可能包含多个线程，比如主线程(Js引擎)，渲染线程，网络线程，GPU线程等等
2. 一个进程下的不同线程会共享数据，但是进程之间的内容相互隔离

1. 一个进程挂了不会影响其他进程，但是同一进程下的线程崩溃会导致整个进程崩溃

结论：为了避免DOM渲染发生冲突



js异步编程原因？

- 因为js是单线程
- 为了提高cpu的利用率





### 差异处理不同任务

JS中有

- 同步任务
- 异步任务



### 同步任务

直接进入执行栈，执行并弹出，一次一个任务



### 异步任务

进入Event Table 并注册回调，触发条件后，将回调加入到回调队列

##### 宏任务

- script
- setTimeout()

- setIntervel()
- setImmediate()

- I/O



##### 微任务

- process.nextTick
- then()

### Event Loop

什么是事件循环

浏览器为了协调事件处理，脚本执行，网络请求和渲染等任务而制定的工作机制

- 任务进入执行栈后，判断是同步还是异步，如果是同步则主线程直接执行
- 如果是异步加入Event Table并注册回调函数

- 异步任务完成后，将注册的函数移入Event Queue
- 当执行栈任务清空后，去获取回调队列头部取出一个任务

什么时候知道执行栈清空了？js引擎存在monitoring process进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去Event Queue那里检查是否有等待被调用的函数。

- 先取出全部的微任务回调
- 每次取一个宏任务回调

重复此过程就是事件循环



宏任务Task：浏览器完成一个宏任务，在下一个宏任务执行开始前，会对页面进行重新渲染。

微任务MicroTask：如果存在微任务，浏览器会清空微任务之后再重新渲染，在处理微任务的回调时新生成的微任务回调也会一并处理。



微任务优先级高于下一次宏任务

一开始，整个script会被当做一个宏任务放进执行栈处理



### setTimeout的含义

并不是延迟n秒后执行，而是在n秒后将回调函数移入到Event Queue，具体延迟时间是大于3秒，具体多久取决于同步任务的执行时长。

HTML5中规定setTimeout的最小时间延迟是4ms。所以理想状态下setTimeout异步回调最快也需要4ms。

### setInterval的含义

会每隔指定的时间将注册的函数置入Event Queue，如果前面的任务耗时太久，那么同样需要等待
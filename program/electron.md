Github公司的跨平台的桌面应用开发框架，使用js，css，html的技术开发桌面端应用。

传统的语言，c++，VB等开发。

vscode facebook 等等都是用electron开发的。



脚手架electron-forge

```javascript
npm install -g @electron-forge/cli
electron-forge init my-new-app

//运行
electron .
//或者
npm start
```



electron-builder将vue打包成electron

```javascript
vue add electron-builder
```



主进程和渲染进程：

- 主线程：package.json 中在main定义的文件就是入口文件，也就是主进程，管理的是这个app窗口BrowserWindow

- - 创建渲染进程
  - 管理应用程序的生命周期

- - 与系统底层交互

- 渲染进程

- - 每创建一个web页面就会创建一个渲染进程
  - 每个web页面运行在自己的渲染进程中

- - 每个渲染进程是独立的，只关心它所运行的页面



主进程包含的模块

- 通知
- 剪切板

- app(掌管声明周期和其他很多事件钩子)
- 通信模块(ipcMain,ipcRenderer)



如何通信？

内置对象ipcMain和ipcRenderer

- ipcMain：在主进程中使用，监听来自ipcRenderer的某个事件，ipcMain.on()
- ipcRenderer：在渲染进程中使用，可以收发消息,ipcRenderer.send(),ipcRenderer.on()

如何主发给渲染？

webContents

win.webContents.send()



### 存储

- lowdb - 基于lodash开发的，有不少好用的插件，JSON为基本存储结构
- nedb - 原生不支持Promise，好几年没有维护了
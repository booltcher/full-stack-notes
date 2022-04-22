ctrl + c 复制行

alt + ↑↓ 向上/下移动行

⌘ + enter 在下面插入行

⌘ ⇧  enter 在上面插入行

⌘ ⇧  \ 跳到匹配的括号

ctrl + Home 文件开头

ctrl + End 文件末尾

ctrl + ⇧ + PageUp 移动当前编辑的文件

option + shift + O 自动清除未使用的import

alt + right 查看定义

alt + left 返回

cmd + K, cmd + S 打开快捷键设置

cmd + K, M 设置文件类型

⌘ + options + T 关闭其他标签卡

⌘ + K + U 关闭已保存标签卡

⌘K, W 关闭全部标签卡

control - 返回上一个编辑的文件

control ⇧ - 下一个编辑的文件

⌘  \ 分割窗口 左右

⌘K, ⌘  \ 上下分割窗口

⌘ = /- 调整大小

control + tab 切换tab

⌘⇧  [  折叠代码段

⌘⇧  ]  展开折叠

⌘⇧  E 打开资源管理(Explorer 文件目录)，需要设置系统快捷键，输入法设置->禁用英文输入快捷键

⌘⇧  F 打开全局搜索字符

⌘ 0 聚焦与侧边栏

⌘ + ` 切换窗口

在可编辑窗口：

⌘ + 方向键 快速跳转到位置





### Issue

1. (windows)当在vscode内置terminal运行某些命令时，遇到报错`无法加载文件 C:\Users\admin\AppData\Roaming\npm\cnpm.ps1，因为在此系统上禁止运行脚本`

1. 1. 右键快捷方式，以管理员身份运行
   2. 在vscode的terminal中运行：`Set-ExecutionPolicy RemoteSigned LocalMachine`
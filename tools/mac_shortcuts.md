command + shift + .隐藏文件

command + m 最小化

command + w 关闭当前窗口

options + esc 语音

command + control + f 全屏

command + options + Y 语雀主窗口

command + N 在语雀中创建笔记



编辑区

⌥  + backspace 删除前一个单词

⌘ + backspace 删除至行首S



### 命令

查看端口占用情况

```bash
lsof -i
lsof -i tcp:80
```

关闭进程

```bash
sudo kill -9 PID
```





### 终端

强制删除文件夹

```bash
sudo rm -rf todo-server
```



#### 使用brew 遇到问题

```bash
usr/local/Homebrew is not writable. You should change the
ownership and permissions of /usr/local/Homebrew back to your
user account:
  sudo chown -R $(whoami) /usr/local/Homebrew
```

解决方式：先执行下面的命令，再去使用brew

```bash
sudo chown -R $(whoami) $(brew --prefix)/*
```



### Mac 插件/软件

1. oh my zsh
2. zsh-z

1. zsh-syntax-highlighting
2. zsh-autosuggestions

1. fuzzy-finder
● 普通模式 Normal
● 插入模式 Insert
● 可视模式 Visual
● 命令模式 : 可在命令行中执行外部的命令
  ○ :ls
  ○ :!rm file

# 模式互转
Normal - Insert
● i 光标前插入
● I 行首插入
● a append光标后插入
● A 行尾插入
● o 下一行插入
● O 上一行插入

Insert - Normal: esc / jj
normal - visual: v
normal - command: 输入冒号

# 操作符
## 光标操作
w work跳到下一个单词开头
b begin跳到本单词或上一个单词开头
e end跳到本单词结尾或下一个单词结尾
ge 跳到上一个单词结尾
gE 同上并包含标点
0 行首
^ 行首第一个非空字符
$ 行尾最后一个非空字符
gg 第一行
G 最后一行
f 查找下一个字符
F 查找上一个字符
;  执行上次的查找
，反向查找上次的查找
d 删除
dw 从当前位置删除到单词末尾
dd 剪切当前行
2dd 删除两行
dfs 找到s删除
y 复制
p 粘贴
u 撤销
c 修改 删除并写入
C 修改从当前位置到行末尾
c$ 同上
ct + 字符 从当前位置开始修改到指定字符串的位置
r 替换光标所在字符
x 替换光标所在字符并进入插入模式

# 动作
i inner
iw word
i( i` i[ i{
it tag
is sentence
i ip paragragh
a around
aw a(  around

标记文本
aw 单词及其标点
iw 单词
ab 小括号
aB 大括号
at 标签

大小写
~
3~ 三个变大小写
g~~ 改变当前行

跳转
nG/ngg 跳转到第n行
gg 跳转到第一行
G 跳转到最后一行
gd 跳转到定义(vim trick)
gh 鼠标悬停
ctrl + o 返回跳转前的位置
gt 切换tab
4gt 第四个tab
g, 跳转到最近修改的地方
command/ctrl 0 文件栏

保存与退出		
:q 退出
:wq 保存并退出
:q! 强制退出
:w 另保存
:x 保存并退出
shitf + zz 普通模式下保存并退出

删除文本
s 删除当前光标所在字符并进入插入模式
S 同cc 删除当前行并进入插入模式
x 删除光标所在字符
X 删除光标所在前一个字符
dd 删除整行
dw 从当前位置删除一个单词
d$  D 删除至行尾
d^ 删除至行首
dG 删除至文档结尾处
d1G 删除至文档首部
c$ 删除至行尾并进入插入模式
das 删除一个句子
dit 删除标签里的内容 删除代码块
ds( 删除外部包裹(vim-surround)
df s 删除到字符s，包括s
dt s删除到字符s之前

粘贴
p 粘贴至光标后
P 粘贴至光标前
ddp 交换当前行和下一行

替换
r + 待替换字母
R 连续替换，直到按下Esc
cc 替换整行
cw 替换一个单词
C 替换游标以后至行末
~ 替换大小写
撤销
u
2u 撤销两次
U 撤销当前行的所有修改
ctrl+ r redo 撤销undo

缩进
>> 整行向右缩进
<< 整行向左缩进
:set shiftwidth=10 设置行缩进字符数
:ce 本行内容居中
:ri 本行文本靠右
:le 本行内容靠右

查找
/ + 要查找的字符串 向下查找
? 向上查找
进入查找后输入
n 继续向下查找
N 查找上一个
:noh 取消查找
\* 查找光标所在单词
\# 向上查找
g\* 部分符合向下查找
g\# 部分符合向上查找

选择
v 进入字符选择模式
vaw 选中单词
shift + v 进入行选择模式
ctrl + v 进入区域选择模式 可用于删除整列

帮助
F1 自己预设的帮助文档
:h shiftwidth 打开名为shiftwidth的帮助文档
:ver 显式版本及参数

全选
全部复制 ggyG
全选 ggvG

标记
ma 标记当前位置为a
`a 跳转到a

翻屏
ctrl + F 屏幕向下滚动一屏
ctrl + B 屏幕向上滚动一屏
ctrl + E 向下滚动一行
ctrl + Y 向上滚动一行
ctrl + D 向下滚动半屏
ctrl + U 向上滚动半屏


文档加密
vim -x file1

高效使用
寄存器
:reg 查看寄存器
"xy回车 复制内容到第x个寄存器里
"xp 粘贴第几个寄存器的内容

移动光标
{} 向前或者向后一个段落，通过空行划分段落
W 忽略标点
f + 字符 同行跳转到字符处 ;分号可以重复上一次f的操作
t + 字符 跳到下一个匹配字符处之前
% 跳到匹配的括号(光标必须位于一侧括号上)
H 到屏幕的第一行
L 到屏幕的最后一行
#向上移动到相同单词
*向下移动到相同单词

批量操作
:normal 后面跟操作(不知道我为什么不生效)

宏
:reg a 查看宏a
q a 开始录制宏a 再按q停止录制
@a 执行宏a


插件
vim easymotion
vim surround 
增强
<leader></leader> 开启增强
支持的操作：
s 查找所有字符
f 向下查找字符
hjkl 移动
w 单词

包裹
搭配宏使用效果更佳
ys 指令

单词包裹
ysiw]
ysiwt p 包裹p标签，如果vscode装了自动close 会有问题
ys3w( 给三个单词包裹括号

至行尾包裹
ys$(

整行包裹yss
yss"

删除包裹
ds(

小技巧
1. 快速复制代码段：
  a. <leader><leader> s 开始的字符 索引
  b.  v }  
  c. 然后使用vscode 的 shift + alt + down
2. 多个参数的常用操作
  a. f(ldf,x 删除第一个参数
  b. f(lct, 修改第一个参数
  c. f,;;;ldf, 分号的个数是参数的序号减去2，第3个是1，第4个是2
  d. f)dF, 修改最后一个参数
  e. f)cT,
3. gJ 去掉这行和下一行中间的空格,J 去掉这一行和下一行中间的空白
4. v 选中然后 ~ 全部改大小写
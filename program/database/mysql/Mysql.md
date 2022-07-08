## 初识数据库

前端 - 页面展示，数据展示，用户交互

后台 - 连接点：连接数据库，连接前端（控制视图跳转，传递数据，处理数据）

数据库 - 存储数据，(txt,excel,word)



### 数据库分类

关系型(SQL)：

- mysql,oracle, sql server

- 通过表和表之间，行和列之间的关系进行数据的存储

  

非关系型(NoSQL)：

- Redis，MongoDB
- 通过对象存储，key-value，通过对象自身的属性来决定



### DBMS（数据库管理系统）

- 数据库的管理软件，科学有效的管理我们的数据，维护和获取数据
- MySQL，数据库管理系统

![DBMS](../../../assets/dbms.png)



## 操作数据库

[官网](https://www.mysql.com/)

- 关系型数据库管理系统
- 原属瑞典MySQL AB公司，现Oracle旗下产品
- 开源
- 体积小，速度快，拥有成本低



### 安装

> 5.7 稳定版本  / 8
>
> 安装建议：
>
> 1、尽量不要使用exe，完全卸载比较麻烦
>
> 2、尽可能使用压缩包
>
> https://dev.mysql.com/downloads/mysql/
>
> https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.19-winx64.zip
>
> 
>
> 安装mysql8.-按照狂神的方法失败了，自己上网搜了很多终于整好了，这里分享一下给大家
> 首先不用创建my.ini，直接初始化然后安装服务
> 初始化要输入“mysqld --initialize --user=root --console”
> 然后安装mysqld
> 最后面的 root@localhost后的文字为初始化后的root 密码，一定要记住
> 然后用set password='123456'重置密码





1. 下载得到安装包

2. 解压

3. 添加环境变量: D:\mysql\mysql-5.7.19-winx64\mysql-5.7.19-winx64\bin

4. 新建配置文件

   ```shell
   # 1. 根目录下创建ini文件 - my.ini
   # 2. 编辑配置文件
   [mysqld]
   basedir=D:\mysql\mysql-5.7.19-winx64\mysql-5.7.19
   datadir=D:\mysql\mysql-5.7.19-winx64\mysql-5.7.19\data  # data会自动生成
   port=3306
   skip-grant-tables # 跳过密码，稍后设置密码后会删除
   ```

5. 启动管理员模式下的CMD，并将路径切换至mysql/bin目录，然后输入`mysqld -install`

6. 输入`mysqld --initialize-insecure --user=mysql`初始化数据文件，会在根目录生成data目录

7. 再次启动mysql，`net start mysql`然后用命令`mysql -u root -p`进入mysql管理界面，密码为空

8. 进入界面后更改root密码

   ```shell
   update mysql.user set authentication_string=password('123456') where user='root' and Host ='localhost';
   
   # 然后输入刷新权限
   flush privileges;
   ```

   

9. 修改my.ini文件注释最后一句# skip-grant-tables

10. 重启即可正常使用

    ```shell
    net stop mysql
    net start mysql
    ```

11. ```shell
    mysql -u root -p123456
    
    D:\mysql\mysql-5.7.19-winx64\mysql-5.7.19\bin>mysql -u root -p123456
    mysql: [Warning] Using a password on the command line interface can be insecure.
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 3
    Server version: 5.7.19 MySQL Community Server (GPL)
    
    Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.
    
    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.
    
    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    # 成功！
    ```

> sc delete mysql 清空mysql



### 可视化工具

#### 安装

1. Navicat https://www.yuque.com/hao6/kkbysk/c1a171de-0ad0-47ee-9aa9-a27cba7e30b6
2. Tableplus
3. DBeaver
4. beekeeper

#### 初始化

1. 右键刷新主机

2. 新建数据库

   ```sql
   -- 字符集：utf8
   -- 排序规则：utf8_general_ci
   -- 可视化操作本质都是mysql的命令， navicat查看历史记录 工具->历史日志
   
   CREATE DATABASE `school` CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'
   ```

3. 创建表

   ```sql
   CREATE TABLE `school`.`student`  (
     `id` int NOT NULL AUTO_INCREMENT COMMENT '学员id\r\n',
     `name` varchar(255) NOT NULL COMMENT '姓名',
     `age` int NOT NULL COMMENT '年龄',
     PRIMARY KEY (`id`)
   )
   ```

> 查看可视化工具语句

```sql
-- 查看创建数据库语句
SHOW CREATE DATABASE `school`;

-- 查看创建表语句
SHOW CREATE TABLE `student`;

-- 查看表的结构
DESC student;
```



### 操作数据库

```sql
-- 连接数据库
mysql -uroot -p123456 

-- 修改密码
update mysql.user set authentication_string=password('123456') where user='root' and Host ='localhost';

-- 刷新权限
flush privileges;

-- 查看数据库列表
show databases;

-- 查看所有表
show tables;

-- 查看表信息
describe student;

-- 退出连接
exit;

-- 删除数据库
DROP DATABASE [IF EXISTS] school;

-- 使用数据库
USE `school`;

```



### 字段属性

> Unsigned

- 无符号的整数
- 声明该列不能为负数

> Zerofill

- 0填充的
- 不足的位数，使用0来填充

> 自增

- 自动在上一条记录的基础上+1(默认)
- 通常用来设置唯一的主键
- 可以自定义设置主键的起始值和步长

> 非空

- not null假设设置为非空，如果不给赋值就会报错
- null 默认值为null

> 默认

-  设置默认的值





### 列类型

> 数值

- tingint 十分小的数据 1个字节 
- smallint 较小的数据 2个字节 
- mediumint 中等大小 3个字节
- int 标准的整数 4个字节 :heavy_check_mark: 设置长度只是设置0填充的显示长度
- big 较大的数据 8个字节
- float 浮点数 4个字节
- double 双精度浮点数 8个字节
- decimal 字符串形式的浮点数 一般使用在金融计算的时候 :heavy_check_mark:

> 字符串

- char 固定大小的字符串 0~255
- varchar 可变长度的字符串 0~65535 :heavy_check_mark:
- tingtext 微型文本 2^8 - 1
- text 文本串 保存大型文本 2^16 - 1 :heavy_check_mark:

> 时间日期

- date YYYY-MM-DD 日期
- time HHHH:mm:ss 时间
- datetime YYYY-MM-DD HHHH:mm:ss 最常用的 :heavy_check_mark:
- timestamp 时间戳  :heavy_check_mark:
- year 年份表示

> 空值

- null





### 创建表

> 查看可视化工具语句

```sql
-- 查看创建数据库语句
SHOW CREATE DATABASE `school`;

-- 查看创建表语句
SHOW CREATE TABLE `student`;

-- 查看表的结构
DESC student;
```

```sql
CREATE TABLE IF NOT EXISTS `student` (
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学生id',
	`name` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`sex` VARCHAR(20) NOT NULL DEFAULT '男' COMMENT '性别',
	`email` VARCHAR(20) NULL COMMENT '邮箱',
	PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
```



### 数据表的类型

#### 了解：数据库引擎

> INNODB 默认使用
>
> MYISAM 早些年使用的



|              | MYISAM | INNODB        |
| ------------ | ------ | ------------- |
| 事务支持     | 不支持 | 支持          |
| 行锁         | 不支持 | 支持          |
| 外键约束     | 不支持 | 支持          |
| 全文索引     | 支持   | 不支持        |
| 表空间的大小 | 较小   | 较大，约为2倍 |

常规使用操作：

- MYISAM：节约空间，速度较快
- INNODB：安全性高，事务的处理，多表多用户操作

> 所有数据库文件都存在data目录下
>
> 本质还是文件的存储
>
> 在物理空间存在的位置
>
> *.frm 表结构的定义文件

- INNODB: *.frm ibdata1
- MYISAM: *.frm MYD 数据文件，MYI索引文件



#### 字符集编码

> charset=utf8

不设置的话，会是mysql默认的latin1，不支持中文

设置方法：

1. charset 表级别  :+1:
2. ini中配置`character-set-server=utf8` 



### 修改删除表



```sql
-- 修改表名称
ALTER TABLE student RENAME AS student1; 

-- 增加字段
ALTER TABLE student1 ADD age INT(11);

-- 修改字段
-- 1.修改约束和类型
ALTER TABLE student1 MODIFY age varchar(11);

-- 2.重命名和类型
ALTER TABLE student1 CHANGE age age1 INT(1);

-- 3.删除字段
ALTER TABLE student1 DROP age1;

-- 删除表
DROP TABLE IF EXISTS student1;
```





## MySQL数据管理

### 了解 :green_book:：外键

删除有外键关系的表时，要先删除引用的表。比如要在删除grade之前先删除student。

> 方式一：创建表时增加约束，比较麻烦，实际开发一般不这么用

```sql
CREATE TABLE IF NOT EXISTS `grade` (
	`gradeid` INT(4) NOT NULL AUTO_INCREMENT COMMENT '年级id',
	`name` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '年级名',
	PRIMARY KEY (`gradeid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `student` (
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学生id',
	`name` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`gradeid` INT(4) NOT NULL COMMENT '年级',
	PRIMARY KEY (`id`),
    KEY `FK_gradeid` (`gradeid`),
    CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade`(`gradeid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
```



> 方式二：创建之后添加约束

```sql
ALTER TABLE `student`
ADD CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade`(`gradeid`) 
```

以上操作添加外键都是物理外键，数据库级别的外键，不建议使用，避免造成困扰。



**最佳实践：**

- 数据库就是单纯的表，只用来存数据，否则每次做DELETE或者UPDATE都必须考虑外键约束，会导致开发的时候很痛苦，测试数据极不方便。
- 我们想使用外键（引用），用程序（在应用层）去实现





### :key:：DML语言 

Data manipulation language：数据操作语言

- insert
- update
- delete



#### 插入

```sql
-- INSERT INTO 表名([字段1， 字段2， 字段3]) values('值1','值2','值3');
-- 由于主键自增，我们可以省略
-- 如果不写字段，就会一一匹配
insert into `grade`(`name`) values('大四');

-- 插入多个
insert into `grade`(`name`) values('大二'),('大一');

--插入多个值的多个字段
insert into `student`(`name`, `sex`) 
values('张三','男'),('李四'，'女');
```



#### 修改

```sql
update `grade` set `name`='研一' where gradeid=4;

-- 不指定条件的情况下，会改动所有记录！
update `grade` set `name`='研一';

-- 修改多个属性
update `grade` set `name`='研二', fee='200' where gradeid=5;
```



**where子句**

后跟一个条件

| 操作符             | 含义                   | 范围  |
| ------------------ | ---------------------- | ----- |
| =                  | 等于                   |       |
| <> !=              | 不等于                 |       |
| between ...and ... | 在某个范围内，闭合范围 | [2,5] |
| and                | 并且                   |       |
| or                 | 或者                   |       |



#### 删除

```sql
delete from `grade` where gradeid=1;

delete from `grade`; -- 全部删除，不这么用
```



#### 清空表的数据

```sql
truncate table `grade`;
```



> delete 和 truncate 区别

- 同：只删除数据，表的结构和索引还在。
- 异
  - truncate 重新设置自增列，计数器归零
  - truncate 不会影响事务

> 了解：delete删除的问题，重启数据库，现象

- innoDB 自增列会从0开始（存在内存中的，断电即失）
- myisam 继续从上一个自增量开始（存在文件中，不会丢失）



### :key:：DQL

Data query language：数据查询语言

- 所有的查询操作都用它 Select
- 简单的查询，复杂的查询都能做
- 最核心的，最重要的，使用频率最高的语言

> select语法

```sql
select [ALL | distinct]
{ * | table.* | [table.field1[as alias1][,table.field[as alias2]][,...]]}
from table_name [as table_alias]
	[left | right | inner join table_name2] --联合查询
	[where ...] --条件查询
	[group by...] --指定结果按照哪几个字段来分组
	[having]    --过滤分组的记录必须满足的次要条件
	[order by]  --指定查询记录按一个或多个条件排序
	[limit {[offset,]row_count | row_countOFFSET offset}]; --指定查询的记录从哪条至哪条
```



#### 查询全部

```sql
select * from student;
select * from result;
```



#### 查询指定字段

```sql
select `studentNo`,`studentName` from student;
```



#### 别名

> 有的时候列的名字不是很明了，可以用as取别名

```sql
-- 字段别名
-- 表别名
select `studentNo` as 学号,`studentName` as 学生姓名 from student as s;
```



#### 去重

 去除select查询出来的结果中重复的数据，重复的数据只显示一条

```sql
-- 查询有哪些同学参加了考试，有成绩
select distinct `studentNo` from result result;
```



#### where条件子句

**where [条件]** 检索数据中符合条件的值。

搜索的条件由一个或者多个表达式组成，结果为布尔值。

[官方文档](https://dev.mysql.com/doc/refman/5.7/en/built-in-function-reference.html)

> 逻辑运算符：尽量使用英文字母

| 运算符  | 语法              | 描述   |
| ------- | ----------------- | ------ |
| and &&  | a and b   a&&b    | 逻辑与 |
| or \|\| | a or b     a\|\|b | 逻辑或 |
| not !   | not a        !a   | 逻辑非 |

```sql
-- 查询成绩在95 ~ 100之前
select studentNo, studentResult from result 
where studentResult >= 95 and studentResult <=100;

select studentNo, studentResult from result 
where studentResult between 95 and 100;

-- 查询id不是1000
select studentNo, studentResult from result 
where not studentNo 1000;

```

> 比较运算符：模糊查询

| 运算符      | 语法              | 描述                       |
| ----------- | ----------------- | -------------------------- |
| is null     | a is null         |                            |
| is not null | a is not null     |                            |
| between     | a between b and c |                            |
| like        | a like b          | 如果a能够匹配到b，结果为真 |
| in          | a in (a1,a2,a3)   | 假设a在列表里              |

> like

```sql
-- 查询姓赵的同学 %代表任意多个字符
select studentNo, studentname from student where studentname like '赵%';

-- 查询姓赵且名只有一个字的同学 _代表只有一个字符
select studentNo, studentname from student where studentname like '赵_';

-- 查询姓赵且名有两个字的同学 _代表只有一个字符 __就是两个字符
select studentNo, studentname from student where studentname like '赵__';

-- 查询名字中包含‘强’的同学
select studentNo, studentname from student where studentname like '%强%';


```

> in

```sql
-- 查询1001,1002学号的学生
select studentNo,studentname from student where studentno in (
'1001','1002');

-- 查询在陕西和广东深圳的学生
select studentNo,studentname,address from student where address in (
'陕西','广东深圳');
```

> is (not) null

```sql
select studentname,address from student where address is not null;
select studentname,address from student where address is null;
```



#### 联表查询

> join 
>
> 1. 分析查询的字段分别来自哪个表
> 2. 确定使用哪种连接查询？7种
>    1. 确定交叉点
>    2. 判断的条件



![在这里插入图片描述](http://rafs7sum2.hb-bkt.clouddn.com/note-images/20200204031532319.png)



```sql
-- 查询参加了考试同学的学号，姓名，科目编号，分数
-- inner join
select s.studentNo,studentName,subjectNo,studentResult from student as s inner join result as r no s.studentNo=r.studentNo;

-- right join
select s.studentNo,studentName,subjectNo,studentResult from student as s right join result as r on s.studentNo=r.studentNo;

-- left join
select s.studentNo,studentName,subjectNo,studentResult from student as s left join result as r on s.studentNo=r.studentNo;

```

| 操作       | 描述                                         |
| ---------- | -------------------------------------------- |
| inner join | 如果表中至少有一个匹配的值，就返回行         |
| right join | 即使左表中没哟匹配，也会从右表中返回所有的值 |
| left join  | 即使右表中没有匹配，也会从左表中返回所有的值 |

:bulb:结论：左连接就是以左边表为基准，右连接就是以右边的表为基准

```sql
-- 查询缺考的人
select s.studentNo,studentName,subjectNo,studentResult from student as s left join result as r on s.studentNo=r.studentNo no studentResult is null;

```

:question:联表查询中on和where的差别？



```sql
-- 查询参加了考试的学生的：学号，姓名，科目名，分数
select s.studentNo,studentName,subjectName,studentResult 
from student s 
right join result r on r.studentNo=s.studentNo
inner join subject as sub on r.subjectNo=sub.subjectNo;

-- 查询学员所属的年级：学号，姓名，年级名称
select studentNo,studentName,gradeName 
from student s
inner join grade g 
on s.gradeid=g.gradeid;
```



##### 自连接

自己的表和自己的表连接

核心：一张表拆为两张一样的表

```sql
-- 查询分类信息，希望得到一个父子结构
select a.categoryName as '父栏目',b.categoryName as '子栏目'
from category as a,category as b
where a.categoryid=b.pid;
```



#### 分页

缓解数据库压力，提高用户体验

```sql
-- limit[start],[count]
select * from result order by studentResult desc limit5,5;

-- 第1页 limit 0,5
-- 第2页 limit 5,5
-- 第3页 limit 10,5
-- 第n页 limit (n-1)*pageSize, pageSize

-- pageSize       			页面大小
-- (n-1)*pageSize 			起始值
-- n              			当前页
-- (total/pageSize)向上取整	 总页数
```



#### 排序 

```sql
-- 查询成绩，根据降序排列
select * from result order by studentResult desc;

-- 查询成绩，根据升序排列
select * from result order by studentResult asc;
```



#### 子查询

where 的条件也是一个查询语句

```sql
-- 查询高等数学-1所有的考试结果：学号，科目编号，成绩，降序
-- 方式一
select studentNo,r.subjectNo,studentResult
from result r
inner join subject sub
on r.subjectNo=sub.subjectNo
where subjectName='高等数学-1'
order by studentResult desc;

-- 方式二: 子查询（由里及外）
select studentNo,subjectNo,studentResult
from result
where subjectNo=(select subjectNo from subject where subjectName='高等数学-1');

-- 查询分数不小于80分的学生的学号和姓名
select distinct s.studentNo,studentName
from student s
inner join result r
on r.studentNo=s.studentNo
where studentResult >=80;

select distinct studentNo,studentName
from student
where studentNo in 
(select studentNo from result where studentResult>=80);

-- 在以上基础上过滤出科目是高等数学-1的subjectNo
select distinct s.studentNo,studentName
from student s
inner join result r
on r.studentNo=s.studentNo
inner join subject sub
on r.subjectNo = sub.subjectNo
where subjectName='高等数学-1';

select distinct s.studentNo,studentName
from student s
inner join result r
on r.studentNo=s.studentNo
where studentResult >=80 and subjectNo=(
    select subjectNo from subject where subjectName='高等数学-1'
);

select studentNo,studentName from student where studentNo in (
	select studentNo from result where studentResult>80 and subjectNo=(
    	select subjectNo from subject where subjectName='高等数学-1'
    )
);


```

### 函数

[官方文档](https://dev.mysql.com/doc/refman/5.7/en/built-in-function-reference.html)

#### 了解 :green_book:：常用函数 

```sql
select concat('姓名：', studentName) as 新名字 from student;
-- 数学运算
select abs(-8) 	 	--绝对值
select ceiling(4.5) 	--向上取整
select floor(4.5)		--向下取整
select rand()           --随机数
select sign(0)			--判断一个数的符号  负数-1 整数1 0-0

-- 字符串
select char_length('不不不不争')	--字符串长度
select concat('我','是')		  --字符串拼接
select insert('我爱编程',1,2,'超级热爱')	--指定位置插入字符串
select upper('zbs')
select lower('ABC')
select instr('不争','不')
select replace('坚持就能成功','坚持','努力')
select substr('坚持就能成功',4,2)
-- 查询姓赵的同学，改为姓王，只是改查询结果，不修改数据
select replace(studentname,'赵','王') from student
where studentname like '赵%';

-- 时间和日期
select current_date()
select curdate()
select now()
select localtime()
select sysdate() --系统时间
select year(now())

-- 系统
select user()
-- 版本
select version()

-- 计算
select 100*3-1 as 计算结果;
select `studentNo`,`studentResult` + 1 as '提分后' from result;

-- 查询自增步长
select @@auto_increment_increment;
```



#### 聚合函数

| 函数名 | 描述   |
| ------ | ------ |
| count  | 计数   |
| sum    | 求和   |
| avg    | 平均值 |
| max    | 最大值 |
| min    | 最小值 |
|        |        |

```sql
-- 三个都能统计：

select count(studentname) from student; -- 指定列：忽略所有的null值
select count(*) from student;			-- 不会忽略null值
select count(1) from student;			-- 不会忽略null值

```

> 执行效率上：count(主键列名) > count(1) > count(非主键列名)
>
> 如果表多个列没有主键，count(1) > count(*)
>
> 如果有主键，count(主键列名)最优
>
> 如果只有一个字段，count(*)最优



### 扩展​ :balloon::数据库级别的MD5加密

> 什么是MD5？
>
> 主要增强算法和强度
>
> 是不可逆的

```sql
create table `testmd5` (
	`id` int(4) not null,
	`name` varchar(20) not null,
	`pwd` varchar(50) not null,
	primary key (`id`)
) engine=innodb default charset=utf8;


insert into testmd5 values(1,'zhangsan','123456'),(2,'lisi','123456'),(3,'wangwu','123456');

update testmd5 set pwd=md5(pwd) where id=1;

-- 插入的时候加密
insert into testmd5 values(4,'xiaoming',md5('123456'));

-- 校验：将用户传递过来的密码进行加密后比对加密的值
select * from testmd5 where name='xiaoming' and pwd=md5('123456');
```



### 事务

将一组SQL放在一个批次中去执行。

> 事务原则：ACID原则 原子性，一致性，隔离性，持久性

**原子性(Atomicity)**

要么都成功，要么都失败

**一致性(Consistency)**

事务提交前后数据完整性要一致

**隔离性(lsolation)**

多个事务互相隔离，针对多个用户同时操作，排除其他事务对本次事务的影响

**持久化(Durability)**

事务一旦提交则不可逆，持久化到数据库中



隔离所导致的问题：

- 脏读：一个事务读取了另一个事务未提交的数据
- 不可重复读：在一个事务内读取表中的某一行数据，多次读取结果不同。（这个不一定是错误，只是场合不对）
- 虚度（幻读）：指在一个事务内读取到了别的事务插入的数据，导致前后读取不一致。（一般是行影响，多了一行）

>  MySQL 默认开启事务自动提交

```sql
set autocommit = 0; --关闭
set autocommit = 1; --开启（默认）
```



```sql
set autocommit = 0; --关闭
start transaction;
insert xxx
insert xxx
commit;/rollback;
set autocommit = 1; --开启（默认）

savepoint <存档>;      --设置一个事务的保存点
release savepoint <保存点名>;  --撤销保存点
```



> 模拟：转账

```sql
create database shop character set utf8 collate utf8_general_ci;

insert into `account`(`name`,`money`)
values('A', 2000.00),('B', 10000.00);

set autocommit=0;

start transaction;

update account set money=money-500 where `name` = 'A';
update account set money=money+500 where `name` = 'B';

commit;

set autocommit = 1;
```



#### 事务隔离级别

**读未提交 Read uncommitted**

 :+1:解决数据丢失

:-1: 脏读

可以通过排他写锁，但是不排斥读线程。避免了数据丢失，却可能出现脏读，即事务B读取到了事务A未提交的数据。



**读提交 Read committed** 

:+1: 解决数据丢失，脏读

:-1: 不可复重复读

如果是读线程，则允许其他事务读写；如果是写，禁止其他事务访问。

避免了脏读，但是可能出现不可重复读。

即A读，B更新提交，A再读，数据已经发生了改变。



**可重复读取 Repeatable read**

:+1: 数据丢失，脏读，不可复重复读

:-1: 幻读

一个事务内，多次读同一个数据，在这个事务还没结束时，其他事务不能读写该数据，这样就可以在同一个事务内连续两次读到的数据是一样的。即读事务允禁止其他写事务，允许读事务，写事务禁止其他所有访问。



**可序化**

:+1:避免脏读、不可重复读、幻读

:-1: 性能差

要求事务序列化执行，事务只能一个接着一个地执行，但不能并发执行。

序列化是最高的事务隔离级别，同时代价也是最高的，一般很少使用。





### 索引

> 索引是帮助MySQL高效获取数据的数据结构。
>
> 提取句子主干，就可以得到索引的本质：索引是数据结构

#### 索引的分类

- 主键索引 （primary key）
  - 唯一的标识，不可重复，只能有一个列作为主键
- 唯一索引（unique key）
  - 避免重复的列出现，唯一索引可以重复，多个列都可以标识为唯一索引
- 常规索引 （index/key)
  - 默认的，可以用index,key关键字来设置
- 全文索引（fulltext）
  - 在特定的数据库引擎下才有
  - 快速定位数据



#### 索引的使用

> 显示所有的索引

```sql
show index from student;
```



> 1. 创建表的时候给字段添加索引
> 2. 创建完毕后，增加索引

```sql
alter table `student` add fulltext index `studentName`(`studentName`);

create index id_app_user_name on app_user(`name`);

-- 分析sql执行的状况
explain select * from student; --非全文索引

explain select * from student where match(studentName) against('王');
```



#### 测试索引

```sql
CREATE TABLE `app_user` (
`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` VARCHAR(50) DEFAULT'' COMMENT'用户昵称',
`email` VARCHAR(50) NOT NULL COMMENT'用户邮箱',
`phone` VARCHAR(20) DEFAULT'' COMMENT'手机号',
`gender` TINYINT(4) UNSIGNED DEFAULT '0'COMMENT '性别（0：男;1:女）',
`password` VARCHAR(100) NOT NULL COMMENT '密码',
`age` TINYINT(4) DEFAULT'0'  COMMENT '年龄',
`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT = 'app用户表'

-----插入100w条数据-----
delimiter $$ --写函数前必须写，当做标志
create function mock_data()
returns int
begin
	declare num int default 1000000;
	declare i int default 0;
	while i<num do
		-- 插入语句
	insert into app_user(`name`,`email`,`phone`,`gender`,`password`,`age`)
    values(
    concat('用户',i),
    '12345678@gmail.com',
    concat('18',floor(rand()*999999999)),
    floor(rand()*2),
    uuid(),
    floor(rand()*100)
    );
		set i = i+1;
	end while;
	return i;
end;

----- 测试索引 --------
select * from app_user where `name`='用户9999'; -- 0.653s

explain select * from app_user where `name`='用户9999'; -- rows 992154

create index id_app_user_name on app_user(`name`);

select * from app_user where `name`='用户9999'; -- 0.026s

explain select * from app_user where `name`='用户9999'; -- rows 1

```

**索引在小数据量的时候用处不大，但是在大数据的时候，效果十分明显。**



#### 索引原则

- 索引不是越多越好
- 不要对进程变动数据加索引
- 小数据量的表不需要加索引
- 索引一般加在常用来查询的字段上

> 索引的数据类型

http://blog.codinglabs.org/articles/theory-of-mysql-index.html





#### 权限管理

##### 用户管理

> SQL 命令操作

用户表：MySQL.user

本质就是对这张表进行增删改查

```sql
-- 创建用户
create user buzheng identified by '123456';

-- 修改当前用户密码
set password=password('111111');

-- 修改指定用户密码
set password for buzheng=password('111111');

-- 重命名
rename user buzheng to buzheng2;

-- 授权 on database.table
grant all privileges on *.* to buzheng2;

-- 查看权限
show grants for buzheng2;

-- 查看管理员权限
/*
GRANT PROXY ON ''@'' TO 'root'@'localhost' WITH GRANT OPTION
*/
show grants for root@localhost;

-- 撤销权限
revoke all privileges on *.* from buzheng2;

-- 删除用户
drop user buzheng2;
```



#### MySQL备份

- 保证重要的数据不丢失
- 数据转移

备份的方式：

- 备份物理文件

- 可视化工具里手动导出

  - 右键转储

- 命令行导出 `mysqldump`

  ```bash
  # mysqldump -h主机 -u用户名 -p密码 数据库 表名1，表名2 > 物理磁盘位置/文件名
  mysqldump -hlocalhost -uroot -p123456 school student,result >D:/a.sql;
  ```

- 导入

  ```bash
  use school;
  source d:/a.sql;
  
  ---
  mysql -u用户名 -p密码 库名< 备份文件
  ```



#### 数据库设计

数据库设计

糟糕的数据库

- 数据冗余，浪费空间
- 插入和删除麻烦、异常【屏蔽使用物理外键】
- 性能差

良好的数据库

- 节省内存空间
- 保证数据库的完整性
- 方便我们开发系统



**软件开发中，关于数据库的设计**

- 分析需求：分析业务和需要处理的数据库的需求
- 概要设计：设计关系图E-R图



**设计步骤：（个人博客）**

- 收集信息，分析需求
  - 用户表（用户个人信息）
  - 文章表（文章信息：作者，分类，标题，内容，发布时间，修改时间。。。）
  - 评论表（评论人，评论文章，评论内容，评论时间）
  - 分类表（文章分类，创建人）
  - 自定义表（key-value，系统信息，系统设置）
- 标识实体（需求落地到字段）
- 标识实体之间的关系
  - 写博客：user -> article
  - 写分类：user -> category
  - 关注：user -> user
  - 写评论：user -> user -> article 



##### 三大范式

为什么需要数据规范化？

- 信息重复
- 插入异常
- 删除异常
  - 丢失有效信息
- 插入异常
  - 无法正常显示信息



> 第一范式（1NF)

原子性：保证每一列不可再分

> 第二范式（2NF) 前提是第一范式

即每张表只描述一件事情。

> 第三范式（3NF）前提是第一二范式

表中的每一列都和主键直接相关，而不能间接相关。



**规范性 和 性能的问题**

阿里：关联查询的表不得超过三张表

- 考虑商业化的需求和目标（成本，用户体验），数据库的性能更加重要
- 在规范性能问题时，适当考虑规范性
- 故意给某些表添加一些冗余字段。（从多表查询变为单表查询）
- 故意增加一些计算列（从大数据量降低为小数据量：索引）



### JDBC

#### 数据库驱动

驱动：声卡，显卡，数据库

没有驱动，应用程序无法直连数据库



#### JDBC

SUN公司为了简化开发人员的操作（对数据库的统一操作），提供了一套规范（Java操作数据库），俗称JDBC。这些规范的实现由具体的厂商去做。

对于开发人员来说，我们只需要掌握JDBC即可。

java.sql

javax.sql

数据库驱动包





### 锁

#### 全局锁

让整个数据库（所有表）处于**只读**状态，数据库表的增删改（DML）、表结构的更改（DDL）、更新类事物的提交都会被阻塞；

> 用于全库逻辑备份

```bash
mysql> flush table with read lock;

mysql> unlock tables;
```



#### 表级锁

**表锁** 

```bash
mysql> lock table test read;
```



##### MDL(metedata lock)元数据锁






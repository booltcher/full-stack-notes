## ORM

Object Relation Mapping

是一种程序设计技术，用于实现面向对象编程语言里不同类型系统的数据之间的转换。

面向对象的方式与关系型数据库匹配

相当于建立了一个可在编程语言里使用的**虚拟对象数据库**



### ORM模式

- **Active Record(活动记录模式)：**
  简单但不灵活。一个模型对应一个表模型类的一个实例对应表的一条记录 
- **Data Mapping(数据映射模式)：**
  灵活。模型对象和数据表是松耦合关系，只进行业务逻辑的处理，和数据层解耦，需要一个实例管理器来将模型和持久化层做对应。





## TypeORM特性

https://typeorm.biunav.com/zh/

- 多模式：Active Record，Data Mapper

- 灵活：支持多重继承，级联，索引，事务，迁移和自动迁移，连接池，主从复制
- 支持：支持多个/多种数据库连接，跨数据库和跨模式查询，支持命令行工具，MongoDB NoSQL数据库
- 易用：查询缓存，原始结果流，日志，监听者和订阅者
- 跨平台：Nodejs，浏览器，Ionic，Cordova，React Native，Electron
- 语言语法：支持Typescript和Javascript，装饰器





## 数据库连接

可以在项目的根目录中创建一个`ormconfig.json`文件，`createConnection`和`createConnections`将自动从此文件中读取连接选项。



### 配置文件

```typescript
import { createConnection, createConnections, Connection } from "typeorm";

// createConnection将从ormconfig.json / ormconfig.js / ormconfig.yml / ormconfig.env / ormconfig.xml 文件或特殊环境变量中加载连接选项
const connection: Connection = await createConnection();

// 你可以指定要创建的连接的名称
// （如果省略名称，则将创建没有指定名称的连接）
const secondConnection: Connection = await createConnection("test2-connection");

// 如果调用createConnections而不是createConnection
// 它将初始化并返回ormconfig文件中定义的所有连接
const connections: Connection[] = await createConnections();
```



### 单个连接

> createConnection

```typescript
import { createConnection, Connection } from "typeorm";

const connection = await createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test"
});

// 使用url
createConnection({
  type: "postgres",
  url: "postgres://test:test@localhost/test"
});
```



### 多个连接

> createConnections

```typescript
import { createConnections, Connection } from "typeorm";

const connections = await createConnections([
  {
    name: "default",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test"
  },
  {
    name: "test2-connection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test2"
  }
]);
```



## 部件

### 实体

是一个映射到数据库表的类

`@Entity()`

每个实体必须有一个主列（如果使用MongoDB，则为ObjectId）



### 实体列

`@Column`对应数据库表的列

`@PrimaryColumn()`主列,可以指定类型uuid

`@PrimaryGeneratedColumn()` 创建一个自增主列

`@CreateDateColumn`自动插入日期

`@UpdateDateColumn` 自动插入更新日期，在调用实例管理器或数据库的save时自动更新





### 列类型

https://typeorm.biunav.com/zh/entities.html#%E5%88%97%E7%B1%BB%E5%9E%8B



#### 枚举类型

> 支持字符串，数字和异构枚举

```typescript
export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    GHOST = "ghost"
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GHOST
    })
    role: UserRole

}
```



#### 数组

```typescript
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array")
    names: string[];
}

const user = new User();
user.names = ["Alexander", "Alex", "Sasha", "Shurik"];
```



#### JSON

```typescript
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-json")
    profile: { name: string; nickname: string };
}
const user = new User();
user.profile = { name: "John", nickname: "Malkovich" };
```



#### 具有生成之的列

```typescript
@Entity()
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    @Generated("uuid")
    uuid: string;
}
```












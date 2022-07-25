## 生成项目目录

```bash
nest new project-name
```



## 服务器上创建数据库

```bash
docker run -d -p 3306:3306 -v /var/lib/mysql -e MYSQL_ROOT_PASSWORD=buzheng --name mysql-for-billiards mysql:5.7
```



## 安装依赖

```bash
# 接口文档
npm i @nestjs/swagger swagger-ui-express 

# 数据库
npm i @nestjs/typeorm typeorm pg
npm install --save @nestjs/typeorm typeorm mysql2


# 全局配置，环境变量
npm i @nestjs/config

# 校验环境变量
npm i joi
npm i --save-dev @types/joi

# 用于输入验证
npm i class-validator class-transformer
```



## 配置

`main.ts`

```ts
// 接口文档
// main.ts - bootstrap

const options = new DocumentBuilder()
.setTitle('CoffeesDoc')
.setDescription('The coffees API description')
.setVersion('1.0')
.addTag('coffees')
.build();

const document = SwaggerModule.createDocument(app, options);

SwaggerModule.setup('api', app, document);

// 全局路由前缀
app.setGlobalPrefix('billiards');
```



### 数据库

```ts
// main.ts 初始化TypeOrmModule，调用forRoot()方法即可允许我们配置与TypeORM的连接以及一些用于Nest集成的附加工具。
// app.module.ts 的imports里配置如下： 主模块用forRoot，子模块用forFeature
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'xxx',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'postgres',
      autoLoadEntities: true,  // 自动加载模块
      synchronize: true,       // 同步，确保typeorm实体在每次运行应用程序时都会与数据库同步，仅用于开发，但要在生产中禁用。使用@Entity()装饰器自动从所有类生成一个SQL表以及元数据。
    }),
```



### 新建.env

```
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_NAME=postgres
DATABASE_PORT=5432
DATABASE_HOST=xxx
```



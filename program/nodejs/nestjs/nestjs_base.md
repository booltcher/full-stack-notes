- [NodeJS 生态现状](#nodejs-生态现状)
- [初识 NestJS](#初识-nestjs)
- [开始](#开始)
  - [结构](#结构)
  - [装饰器](#装饰器)
- [控制器](#控制器)
  - [自动生成](#自动生成)
  - [指定路由](#指定路由)
  - [全局路由前缀](#全局路由前缀)
  - [处理请求](#处理请求)
  - [嵌套 URL](#嵌套-url)
  - [动态数据](#动态数据)
  - [查询参数](#查询参数)
  - [Payload](#payload)
  - [静态状态码](#静态状态码)
  - [使用底层库方法](#使用底层库方法)
  - [修改和删除](#修改和删除)
- [服务](#服务)
  - [错误处理](#错误处理)
- [模块](#模块)
- [DTO](#dto)
  - [输入验证](#输入验证)
  - [简化 Dto 代码](#简化-dto-代码)
  - [ValidationPipe 其他功能](#validationpipe-其他功能)
    - [**白名单**](#白名单)
    - [Transform](#transform)
- [数据库](#数据库)
  - [初始化](#初始化)
  - [TypeORM](#typeorm)
    - [**注册 TypeORM**](#注册-typeorm)
      - [**Repository**](#repository)
  - [关系](#关系)
  - [分页](#分页)
  - [事务](#事务)
  - [索引](#索引)
- [依赖注入](#依赖注入)
- [封装](#封装)
- [自定义](#自定义)
  - [useValue](#usevalue)
  - [Provider token](#provider-token)
  - [useClass](#useclass)
  - [useFactory](#usefactory)
    - [异步](#异步)
- [动态模块](#动态模块)
- [Provider 的域](#provider-的域)
  - [指定 provider 的域](#指定-provider-的域)
- [配置](#配置)
  - [自定义 env 路径](#自定义-env-路径)
  - [禁用 env](#禁用-env)
  - [校验环境变量](#校验环境变量)
  - [ConfigService](#configservice)
  - [自定义配置文件](#自定义配置文件)
  - [配置命名空间](#配置命名空间)
  - [异步配置](#异步配置)

## NodeJS 生态现状

- 处理路由
- 代码组织
- 文件结构
- API 调用

> Expressjs Koajs

过高的灵活性是双刃剑，意味着很多功能需要开发者去组合。

## 初识 NestJS

NestJS 通过创建抽象或整体 让开发者专注于 程序本身，而不是如何设置 typescript，api 路由，错误处理，中间件等。

- 开箱即用
- 可测试，可扩展
- layer above nodejs
- 模块化结构，保持代码井井有条，建立清晰的边界
- 架构遵循 SOLID 原则

不局限于某一个框架，利用社区中现成的选项和模块，例如 express 中的，fastify 等等。

（如果要使用 fastify，需要在应用程序中使用不同的 fastify 兼容库。）

Nest 在此提供的灵活性使我们能搞创建于平台无关的模块，这些模块不仅与 esxpress 或 f 等 http 框架无关，甚至于不同类型的应用程序无关。

Nest 可用于构建 RestAPI、MVC 应用程序、微服务、GraphQL 应用、Web sockets、CLI

因为依赖注入，可以毫不费力更换底层机制

## 开始

```bash
## node > 12
npm install -g @nestjs/cli

nest --version

nest new projectName

cd projectName

npm run start
npm run start:dev //热更新

```

### 结构

```bash
main.ts # 入口文件
src     # 代码存放
	coffees # 业务模块
		config # 模块配置
		dto    # 模块dto
		entities #模块实体
		coffees.constants.ts # 模块内常量
		coffees.service.ts # 服务
        coffees.module.ts # 模块
   	config # 公共配置
    events # 事务等
    common # 公用
```

### 装饰器

装饰器可以作用于类，方法，属性甚至参数

Nest 为所有常见的 HTTP 动词提供了装饰器，全都包含在@nestjs/common 这个包中

## 控制器

处理特定请求

### 自动生成

```bash
# 生成控制器命令
nest g co
# 1.src目录生成控制器文件
# 2.自动在app.module.ts中引入控制器
# 3.并添加进controllers数组中
# 4.同时创建了控制器的测试文件，如果不想生成测试文件
nest g co --no-spec
# 5.指定生成位置
nest g co module/abc
# 6.不确定生成的位置是否正确，可以使用试生成命令，查看命令输出
nest g co module/abc --dry-run
```

### 指定路由

`@Controller`可以接收一个字符串，该字符串传递 Nest 创建路由映射所需的元数据，将传入的请求绑定到这个控制器上

```typescript
@Controller('/test')
```

### 全局路由前缀
在`main.ts`中加上`app.setGlobalPrefix()`：
```typescript
app.setGlobalPrefix('nest-app'); // 全局路由前缀
```

### 处理请求

```typescript
export class CoffeesController {
  @Get()
  findAll() {
    return "This action resutrns all coffess";
  }
}
```

### 嵌套 URL

```typescript
@Get('flavors')
```

### 动态数据

```typescript
// 接收所有参数
@Get(':id')
findOne(@Param() params) {
	return `The parmas contains ${params.id}`
}

// 接收指定参数
@Get(':id')
findOne(@Param('id') id:string) {
	return `The id: ${id}`
}
```

### 查询参数

```typescript
@Get()
findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return `limit:${limit} offset:${offset}`;
}
```

### Payload

```typescript
@Post()
create(@Body() body) {
	return body;
}

// 获取指定属性，如果访问特定属性，则不会验证其他属性
@Post()
create(@Body('name') name: string) {
    return name;
}
```

### 静态状态码

默认如果请求成功，自动发回状态码：

- 200 - GET
- 201 - POST

自定义`@HttpCode()`

```typescript
@Post()
@HttpCode(HttpStatus.GONE)
create(@Body() body) {
    return body;
}
```

> Nest 内置了枚举类型 HttpStatus 用来表示 HttpCode 的所有类型

### 使用底层库方法

**@Res**

来自 Express 的方法，获取 response 对象，不过这种使用失去了依赖于 Nest 标准响应处理的 Nest 功能的兼容性，比如拦截器和@HttpCode()装饰器。使用底层库的方式不便于测试，因为我们必须 mock response 对象。

> 建议： 尽可能使用 Nest 的方法

```typescript
@Get()
findAll(@Res() res) {
    res.status(200).send('Hello World!');
}
```

### 修改和删除

```typescript
@Patch(':id')
update(@Param('id') id: string, @Body() body) {
    return `This action updates a #${id} cat`;
}

@Delete(':id')
remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
}
```

## 服务

一般负责数据存储和检索，为对应控制器提供一些全局的功能

每一个 Service 都是一个 provider，意思是它可以注入依赖

如此对象之间可以创建各种关系，并且将对象实例连接在一起的逻辑都可以由 NEST 运行时系统处理，而不是自己创建和管理这种类型的依赖注入

```bash
nest g s
nest generate service
```

```typescript
// coffees.service.ts
import { Injectable } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: "Cappuccino",
      price: 6.99,
      description:
        "A cappuccino is an espresso-based coffee drink, made by diluting an espresso with hot water, giving it a similar strength to, but different flavor from, traditionally brewed coffee.",
    },
  ];

  findAll(): Coffee[] {
    return this.coffees;
  }

  findOne(id: number): Coffee {
    return this.coffees.find((coffee) => coffee.id === id);
  }

  create(coffee: Coffee): Coffee {
    this.coffees.push(coffee);
    return coffee;
  }

  update(id: number, coffee: Coffee): Coffee {
    const index = this.coffees.findIndex((c) => c.id === id);
    this.coffees[index] = coffee;
    return coffee;
  }

  delete(id: number): Coffee {
    const index = this.coffees.findIndex((c) => c.id === id);
    const deletedCoffee = this.coffees[index];
    this.coffees.splice(index, 1);
    return deletedCoffee;
  }
}
```

```typescript
// Nest将通过创建CoffeesService实例并将其返回给CoffeesController来解析CoffeesService
import { CoffeesService } from "./coffees.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";

@Controller("coffees")
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll();
  }

  // 接收指定参数
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  create(@Body() body) {
    return this.coffeesService.create(body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body) {
    return this.coffeesService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.coffeesService.delete(id);
  }
}
```

### 错误处理

- 抛出异常
- 响应错误对象
- 创建拦截器利用异常过滤器

```typescript
findOne(id: string): Coffee {
    const coffee = this.coffees.find((coffee) => coffee.id === id);
    if (!coffee) {
        throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);

        throw new NotFoundException(`Coffee with id "${id}" not found`);
    }
    return coffee;
}
```

## 模块

组织特定功能模块相关的代码，建立清晰地便捷，SOLID 原则

- controllers：模块实例化的根
- exports：可以列出该模块对外暴露的成员
- imports：引入其他的 providers
- providers：需要由 Nest 注入器实例化的服务，此处的 providers 只在模块内部可用，除非添加到 exports 中

```typescript
// 生成一个module文件，并在app中引入
nest g module moduleName

// coffees.module.ts
@Module({
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule {}

// app.module.ts
@Module({
  imports: [CoffeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

## DTO

定义数据传输对象结构

```typescript
nest g class dtoName

/*
* create
*/
nest g class coffees/dto/create-coffee.dto --no-spec

export class CreateCoffeeDto {
  readonly name: string;
  readonly price: number;
  readonly description: string;
}

@Post()
create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
}

/*
* update
*/
nest g class coffees/dto/update-coffee.dto --no-spec

export class UpdateCoffeeDto {
  readonly name?: string;
  readonly price?: number;
  readonly description?: string;
}

@Patch(':id')
update(@Param('id') id: string, updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
}
```

### 输入验证

`validationPipe` 提供了可以对传入的有效 payload 强制执行验证规则的便捷方式，只通过在 dto 简单的注释就能指定这些规则

如果请求中的属性类型错误，会自动响应 400 BadRequest，同时返回错误细节

```typescript
// main.ts 添加
app.useGlobalPipes(new ValidationPipe());

// 安装包
npm i class-validator class-transformer

// dto
import { IsString, IsNumber } from 'class-validator';
export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly description: string;

  //@IsString({each: true})
  //readonly flavors: string[];
}
```

### 简化 Dto 代码

在上例中，create dto 和 update dto 有过多重复代码

`mapped-types`可以快捷执行类型的转换

```typescript
npm install @nestjs/mapped-types

// update dto
import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

// 将所有属性标记为可选optional
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
```

### ValidationPipe 其他功能

#### **白名单**

任何未包含在白名单的属性自动从生成的对象中剔除

```typescript
// 修改main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  })
);

// 这样就只会获取dto约定的属性
// 而如果设置
forbidNonWhitelisted: true;
// 则会在不匹配dto时响应400
```

#### Transform

接受到的 payload 并不属于 dto 的实例

```typescript
console.log(createCoffeeDto instanceof CreateCoffeeDto); //false
```

而 ValidationPipe 可以帮我们将这个对象转化为我们所期望的

```typescript
// main.ts设置
transform: true;

console.log(createCoffeeDto instanceof CreateCoffeeDto); //true
```

## 数据库

选用 postgres

### 初始化

```bash
npm i @nestjs/typeorm typeorm pg
```

```typescript
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

### TypeORM

每个 Entity 类代表一张数据库表，默认情况下，TypeORM 会根据我们的小写类名来命名 SQL 表。

如果想使用不同的表名，可以传参给@Entity()指定。

**@PrimaryGeneratedColumn**

定义主键与自增

**@Column**

定义普通列，使用列装饰器注释的每个属性都会映射到表的列。

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() // sql table === "coffee"
export class Coffee {
  @PrimaryGeneratedColumn() //主键，自动增加值
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column("json", { nullable: true }) // 可空
  flavors: string[];
}
```

#### **注册 TypeORM**

```typescript
// coffees.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Coffee])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})

// 此时数据库已经生成了coffee表
```

##### **Repository**

是数据的抽象，并提供了很多与数据库交互的方法

**@InjectRepository**

可以将自动生成的存储库注入到 service

**CRUD**

```typescript
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
  ) {}

  findAll() {
    return this.coffeeRepository.find();
  }

  async findOne(id) {
    const coffee = await this.coffeeRepository.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee with id "${id}" not found`);
    }
    return coffee;
  }

  create(CreateCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(CreateCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id "${id}" not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async delete(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }
}
```

### 关系

```typescript
// 修改coffee.entity
@JoinTable()
@ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
})
flavors: Flavor[];

// coffees.service 中注入Flavor
@InjectRepository(Flavor)
private readonly flaverRepository: Repository<Flavor>

// coffees.module 中引入Flavor
imports: [TypeOrmModule.forFeature([Coffee, Flavor])],
```

### 分页

不属于任何一个业务模块的功能放在 common 以便复用

```typescript
nest g class common/dto/pagination-query.dto --no-spec
// 修改
import { IsOptional, IsPositive } from 'class-validator';
export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}

// 修改controllers
@Get()
findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQueryDto);
}

// 修改service
findAll(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    return this.coffeeRepository.find({
        relations: ['flavors'],
        take: limit,
        skip: offset,
    });
}
```

### 事务

```typescript
// 创建Event实体
nest g class events/entities/event.entity --no-spec

// event.entity
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}

// module 中引入
imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])]


// service
private readonly connection: Connection

// 添加方法
async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        coffee.recommendations++;
        const recommendEvent = new Event();
        recommendEvent.name = 'recommend_coffee';
        recommendEvent.type = 'coffee';
        recommendEvent.payload = {
            coffeeId: coffee.id,
        };
        await queryRunner.manager.save(coffee);
        await queryRunner.commitTransaction();
    } catch (err) {
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
    }
}
```

### 索引

`@Index() ` 用于单列

`@Index(['name','type'])` 用于实体

## 依赖注入

依赖反转原则：

1. 高层模块不应直接依赖于底层模块，高层和底层都应该依赖于抽象(interface)
2. 抽象不应该依赖于具体的类方法，类方法应该依赖于 interface

**Nest 中依赖注入的三步骤：**

- 在 service 中使用@Injectable 声明一个可以被**Nest 反转控制容器**管理的类，将该类标记为“提供者”

- controller 的 constructor 中 请求 service，这个请求告诉 Nest 将提供“注入”到 controller，以便我们可以使用它。

  ```typescript
  constructor(private readonly coffeesService: CoffeesService) {}
  ```

- module 在 providers 中列出了 service，所以它向**Nest 反转控制容器**注册了这个提供者。

> 当 Nest 容器实例化 controller 时，会先看是否有依赖项，当找到依赖项 service，会对 service 执行查找，返回 service 类，然后 service 创建 service 实例，将其缓存并返回，如果已经被缓存，就返回那个实例

![image-20220421005345704](http://rafs7sum2.hb-bkt.clouddn.com/note-images/image-20220421005345704.png)

实际上 module 中 providers 完整写法：

```typescript
// 将二者对应起来
providers: [
  {
    provide: CoffeeService, // 实例的token
    useClass: CoffeeService, // 实例的类
  },
];
```

## 封装

**exports:**可以看做是一个模块的公共接口，或 API

## 自定义

### useValue

```typescript
class MockCoffeeService {}
@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [{ provide: CoffeesService, useValue: new MockCoffeeService() }],
})
```

这样每次 CoffeesService TOKEN 被解析时，它将指向新的 MockCoffeesService

### Provider token

自定义依赖，比如依赖项就是一些简单类型字符串或者数字

:chestnut:

> @Inject 告诉 IoC 控制反转容器 在实例化时 要依赖的类

```typescript
// coffees.constants.ts
export const COFFEE_BRANDS = 'COFFEE_BRANDS';

// coffees.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    { provide: COFFEE_BRANDS, useValue: ['Philips', 'Bosch'] },
  ],
})

// coffees.service.ts
@Injectable()
export class CoffeesService {
  constructor(
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
  ) {
    console.log(coffeeBrands);
  }
...
```

### useClass

允许们动态确定一个 Token 应该解析到的 Class

> :chestnut:我们有一个默认的 ConfigService 类，根据当前环境为每个 ConfigService 提供不同的实现

```typescript
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

// coffees.module.ts
providers: [
  { provide: COFFEE_BRANDS, useValue: ["Philips", "Bosch"] },
  CoffeesService,
  {
    provide: ConfigService,
    useClass:
      process.env.NODE_ENV === "development"
        ? DevelopmentConfigService
        : ProductionConfigService,
  },
];
```

### useFactory

可以动态创建 provider，如果需要将 provider 的值基于各种其他依赖项，值等。

返回值会被 provider 使用为 token

```typescript
 { provide: COFFEE_BRANDS, useFactory: () => ['Philips', 'Bosch'] }
```

另一个:chestnut:

```typescript
@Injectable() // 注册为provider
export class CoffeeBrandsFactory {
  create() {
    return ['Starbucks', 'Dunkin Donuts'];
  }
}

{
    provide: COFFEE_BRANDS,
    useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(),
    inject: [CoffeeBrandsFactory], // provider数组,会被传递给useFactory,并且会被注入到useFactory的参数中
},
```

#### 异步

比如：在我们的数据库建立连接之前，我们不想开始接受请求

useFactory 可以返回一个 Promise，允许它等待异步任务

在 Nest 实例化任何一个依赖与该 provider 的类之前，Nest 会等 promise resolve，再使用 COFFEE_BRANDS

> 假设此 provider 的数据必须从数据库中异步查询，然后才能在任何地方使用

```typescript
{
    provide: COFFEE_BRANDS,
    useFactory: async (connection: Connection): Promise<string[]> => {
    	// const coffeeBrands = await connection.query('SELECT name FROM coffee_brands');
        const coffeeBrands = await Promise.resolve([
            'Starbucks',
            'Dunkin Donuts',
        ]);
        return coffeeBrands;
    },
    inject: [Connection], // provider数组,会被传递给useFactory,并且会被注入到useFactory的参数中
},
```

## 动态模块

到此都是静态模块，静态模块不能让 provider 使用配置

:chestnut:

```typescript
// 静态模块
@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: createConnection({
        // 由于使用了硬编码，我们不能轻易地在不同的模块共享，如果另一个应用想使用这个模块但要用不同的端口怎么办？这就是静态模块的短板
        type: 'mysql',
        host: 'localhost',
        port: 3306,
      }),
    },
  ],
})

// 动态模块
@Module()
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: createConnection(options),
        },
      ],
    };
  }
}

// 在其他模块导入
imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    DatabaseModule.register({
        type: 'postgres',
        host: '123',
        port: 5432,
    }),
    CoffeesModule,
],
```

## Provider 的域

@Injection 的 scope 机制可以获取 provider 的生命周期行为

默认情况，每个 provider 都是一个单例 Singelton

比如：在 CoffeesService 中使用@Injectable 时，实际上是一种速记实现，用于将其传递给具有 scope 和 Scope.DEFAULT 的对象

> @Injectable({ scope: Scope.DEFAULT })
>
> scope: Scope.DEFAULT - 单例，尽可能使用单例，性能好
>
> 其他值：
>
> Scope.TRANSIENT - 瞬态
>
> Scope.REQUEST- 只会在每次请求时创建一个新的实例，请求完成后，进行垃圾回收

### 指定 provider 的域

```typescript
{
    provide: COFFEE_BRANDS,
	scope: Scope.TRANSIENT，
},
```

Nest 会使注入链向上冒泡，如果 controllers 依赖于了 scope 是 Scope.REQUEST 的 service，它也隐式地变为 REQUEST 范围。

## 配置

ConfigModule：从默认位置（根目录）加载.env 文件，并将 env 中的键值对与`process.env`的环境变量合并存储在私有结构中，可以用 ConfigService 类在 app 的任意位置访问

> nodejs 程序中常使用 env 设置秘钥，数据库选项，密码等，来自 process.env 默认的值都是 string

```bash
npm install @nestjs/config
```

配置 env

```bash
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_NAME=postgres
DATABASE_PORT=5432
DATABASE_HOST=xxx
```

使用 env

```typescript
TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
}),
```

### 自定义 env 路径

如果再多个文件中找到相同的变量，以第一个为准

```typescript
ConfigModule.forRoot({
  envFilePath: ".env",
});
```

### 禁用 env

```typescript
ignoreEnvFile: true;
```

### 校验环境变量

使用 joi 包

https://joi.dev/api/

安装依赖

```bash
npm i joi
npm i --save-dev @types/joi
```

配置校验规则

> 默认变量都是可选的
>
> 用`import * as Joi from 'joi';`代替`import Joi from 'joi';`

```typescript
ConfigModule.forRoot({
  validationSchema: Joi.object({
    DATABASE_HOST: Joi.required(),
    DATABASE_PORT: Joi.number().default(5432),
  }),
});
```

### ConfigService

在其他模块中使用

```typescript
// module中引入ConfigModule，因为在app.module使用了forRoot，所以这里什么也不用设置
@Module({
  imports: [
    ConfigModule,
  ]
...

// service的构造函数中引入
import { ConfigService } from '@nestjs/config';
constructor(
    ...
    private readonly configService: ConfigService
)

// 使用，提供了一个get方法可以获取到环境变量
// 只是期望的参数类型，只是编译器的信息，不会执行任何类型转换或解析
// get方法可以接受第二个参数作为默认值
this.configService.get<string>('DATABASE_HOST');

```

### 自定义配置文件

可以根据业务的 scope 来进行分组配置

将相关配置存储在单个文件中，独立管理

```typescript
// 创建文件 src/config/app.config.ts 用来管理全局配置

export default () => ({
  environment: process.env.NODE_ENV || "development",
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT) || 5432,
  },
});

// 引入：app.module中
import appConfig from "./config/app.config";
ConfigModule.forRoot({
  load: [appConfig],
}),
  // 使用：coffees.service 可以通过对象的方式来获取值
  this.configService.get("database.host");
```

### 配置命名空间

自定义文件通过 ts 的方式来定义配置，虽然方便，但是随着功能不断增加，配置文件中越来越多的配置键，使用非类型化的方式，不便于维护，且容易出错

为防止这种情况，可以结合 配置命名空间 和 部分注册 来验证配置中的键

```typescript
// src/coffees/config/coffees.config.ts

import { registerAs } from "@nestjs/config";

export default registerAs("coffee", () => ({
  foo: "bar",
}));
```

> registerAs()函数可以注册一个命名空间配置对象 - coffee(第一个参数)
>
> 使用 forRoot 在根模块中配置，但是难免要对个别模块进行单独配置，可以使用 forFeature

```typescript
// coffees.module - imports
ConfigModule.forFeature(coffeesConfig);

// service中使用，这样依旧是非类型化的
this.configService.get("coffee.foo");
```

:heart:**最佳方案**

每个命名空间都暴露了一个 KEY 属性，可以使用 KEY 将整个对象注入到在 Nest 注册的任何类，我们可以在类中直接访问这个对象，而不是通过 get 方法

```typescript
@Inject(coffeesConfig.KEY)
private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>
...
console.log(coffeesConfiguration.foo);
```

### 异步配置

如果在 app.module 中将 TypeOrmModule 放在 ConfigModule 之前，会连接不上数据库，因为在配置数据库之后才初始化了 env，这样会报错

解决方法：使用`forRootAsync`

```typescript
TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
}),
```

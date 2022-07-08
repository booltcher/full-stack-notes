## 异常过滤器



### 内置过滤器

`HttpException`

Nest中有一个内置的异常层，在程序未处理异常时，捕获该异常并发送友好的响应。

![image-20220423135551162](http://rafs7sum2.hb-bkt.clouddn.com/image-20220423135551162.png)

异常过滤器处理HttpException以及其子类的异常。当异常既不是HttpException也不是HttpException的子类时，内置异常过滤器会生成默认的JSON响应：

```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```





### 异常过滤器

如果需要为异常状况添加日志或者使用不同的JSON，可以使用异常过滤器，可以完全控制响应逻辑和内容，用来自定义返回错误结构。



#### 创建

**@Catch** - 表明捕获的异常类型，可以传入多个参数用逗号隔开

异常过滤器应该实现 `ExceptionFilter<T>`接口。提供`catch(exception: T, host: ArgumentsHost)`方法。T表示异常类型。

> ArgumentsHost 是 Nest提供的执行上下文：
>
> 对于HTTP服务器使用时：
>
> - @nestjs/platform-express：host对象封装了Express的[request, response, next]
>
> - GraphQL：host包含了[root, args, context, info]

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        status === HttpStatus.FORBIDDEN
          ? "you don't have permission, please check your token"
          : exception.message,
    });
  }
}
```



#### 使用

异常过滤器的作用域分为不同级别：

方法 - 控制器 - 全局



**方法作用域**

```typescript
// cat.controller.ts
import { UseFilters } from "@nestjs/common"
...
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

以上是将过滤器实例传递给了控制器

:+1:推荐传递**类**，将实例化的工作交给框架，并启用依赖注入，这样可以减少内存使用，Nest可以在这个模块中重用同一类的实例

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```



**控制器作用域**

```typescript
@UseFilters(HttpExceptionFilter())
export class CatsController {}
```



**全局作用域**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```





### 捕获所有异常

@Catch()参数列表留空

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

```





## 管道

Pipe是用`@Injectable()`注解的类，它实现了`PipeTransform`接口。

管道在异常层，在请求进入路由前执行，如果发生错误就不会到达路由。

![image-20220423143348291](http://rafs7sum2.hb-bkt.clouddn.com/image-20220423143348291.png)

管道有两个典型的用处：

- **转换** 将输入数据转换为所需的形式（string => number）
- **验证** 验证输入是否有效，不正确时抛出异常



### 内置管道

Nest@nestjs/common包提供了8个开箱即用的管道：

- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe



### 使用

在进入路由后进行ParseInt，解析成功则执行控制器方法，如果解析失败，则抛出错误

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```



默认抛出错误如：

```json
{
    "statusCode": 400,
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request"
}
```



如果要自定义管道行为，可以通过传递实例

```typescript
@Get(':id')
async findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
  return this.catsService.findOne(id);
}
```



### 自定义管道

```bash
nest g pipe common/pipes/int-parser
```

```typescript
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IntParserPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new Error('Validation failed');
    }
    return val;
  }
}

// coffees.controller.ts 使用
@Get(':id')
async findOne(
    @Param('id', IntParserPipe)
    id: string,
) {
    console.log('id', id);

    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.findOne(id);
}
```







## 守卫

Guard的职责：确定是否允许请求访问某些内容

如果满足某些条件，例如权限、角色、ACL等，可以访问路由；

如果不满足条件，将被定义为错误并抛出

> 最佳用例：身份验证和授权

:chestnut: 设计一个Guard

- 验证API-KEY是否存在与"authorization"Header中
- 正在访问的路由是否是public的

```bash
nest g guard common/gurads/api-key
```

> Guard 应该实现CanActivate接口，并提供一个canActivate的方法，这个方法应该返回一个布尔值，指示当前请求是否被允许访问路由。该方法也可以返回一个promise。

命令会生成一个默认返回true的Guard

使用：

```typescript
// main.ts (后续优化)
app.useGlobalGuards(new ApiKeyGuard());
```

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authorization');

    return isPublic || authHeader === this.configService.get('API_KEY');
  }
}

```

**自定义装饰器**：为控住器路由设置元数据

```typescript
// public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// coffees.controller.ts 使用
@Get()
@UseFilters(HttpExceptionFilter)
@Public()
findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    // throw new ForbiddenException();
    return this.coffeesService.findAll(paginationQueryDto);
}
```



优化引入方式：

```typescript
nest g mo common

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './gurads/api-key.guard';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class CommonModule {}

// app.module.ts 中使用
imports: [CommonModule]
```





## 拦截器

Interceptor都应该实现从@nestjs/common导出的`NestInterceptor`接口，这个接口要求我们提供一个intercept方法，返回值是一个`Observable`，来自于rxjs库，用来控制请求/响应流，是回调或者promise的强大替代品。这个方法里要调用`next.handle()`，否则路由处理程序不会执行



### 创建拦截器

:chestnut: 创建一个拦截器来包裹我们的响应结果

```bash
nest g interceptor common/interceptors/wrap-response
```

```typescript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('before...');

    return next.handle().pipe(
      map((data) => ({
        data,
      })),
    );
  }
}

```



### 全局使用

```typescript
// main.ts
app.useGlobalInterceptors(new WrapResponseInterceptor());
```



### 处理超时

 :chestnut: 设计一个拦截器，在所有的路由在一段时间没有响应结果时，终止请求，并返回错误信息。

```bash
nest g interceptor common/interceptors/timeout
```

```typescript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(timeout(3000));
  }
}

```

为了测试修改controllers：

```typescript
// coffees.controller.ts
...
@Get(':id')
async findOne(
    @Param()
    id: string,
) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.findOne(id);
}
```

这时触发了timeout

![image-20220424005013753](http://rafs7sum2.hb-bkt.clouddn.com/image-20220424005013753.png)

但是提示并不是很明确，修改代码，如果是超时错误，给明确的信息

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(3000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  }
}
```





## 中间件

Middleware

中间件是一个在路由处理程序和任何其他构建块(拦截器，守卫，管道)之前调用的函数。中间件可以访问Request 和 Response 对象，而且并不专门绑定于任何方法，而是绑定到指定的路由路径。

> 能做的事：
>
> - 执行代码
> - 更改请求和响应对象
> - 结束请求/响应周期
> - 调用堆栈中调用next函数
>
> 在使用中间件时，如果中间件函数没有结束请求/响应周期，必须调用next，将控制权交给下一个中间件函数，否则请求将被挂起。

中间件可以是Function或Class：

- function 无状态的，不能注入依赖项，并且无权访问Nest容器
- class 可以注入依赖



### 创建

```
nest g middleware common/middleware/logging
```

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');
    res.on('finish', () => {
      console.timeEnd('Request-response time');
    });
    next();
  }
}

```



### 使用

在公共模块中引用

```typescript

export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 指定路由，方法
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: 'coffees', method: RequestMethod.GET });
    // 全部
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
    // 不包括某个路由
    consumer
      .apply(LoggingMiddleware)
      .exclude({ path: 'coffees', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
```







## 自定义装饰器

:chestnut: 定义一个装饰器获取网络协议

```typescript
// common/decorators/protocol.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defaultValue: string, ctx: ExecutionContext) => {
    console.log({ defaultValue });

    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);

```





## Swagger

>  Open API 规范用于描述 RESTful API
>
> - operations
> - input parameters
> - responses
> - authentication



### 安装依赖

```bash
npm install @nestjs/swagger swagger-ui-express
```



### 设置

```typescript
// main.ts - bootstrap

const options = new DocumentBuilder()
.setTitle('CoffeesDoc')
.setDescription('The coffees API description')
.setVersion('1.0')
.addTag('coffees')
.build();

const ducument = SwaggerModule.createDocument(app, options);

SwaggerModule.setup('api', app, ducument);
```

> SwaggerModule的setup方法有三个参数：
>
> 1、挂载SwaggerUI的路由路径 
>
> 2、应用程序 
>
> 3、实例化的文档对象

完成后可以在`localhost:3000/api`查看文档



继续配置：

```json
// nest-cli.json
{
  ...
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": [
      "@nestjs/swagger/plugin"
    ]
  }
}
```

重新启动服务，这时文档已经反应了`CreateCoffeeDto`以及所有属性，但是Patch方法的`UpdateCoffeeDto`还是缺少信息

修改UpdateCoffeeDto中的`PartialType`来源：

```typescript
import { PartialType } from '@nestjs/swagger';
```

刷新页面已经ok了！:slightly_smiling_face:



### 定义示例/描述

```typescript
// create-coffee.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Flavor } from '../entities/flavor.entity';
export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of the coffee', example: 'Cappuccino' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The price of the coffee', example: 88 })
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: 'The flavors of the coffee',
    example: ['Vanilla', 'Chocolate'],
  })
  @IsOptional()
  @IsString({ each: true })
  readonly flavors: string[];
}

```



### 定义响应

@ApiResponse()

用于控制器方法：

```typescript
@ApiResponse({
    status: HttpStatus.Forbidden
    description: 'Successful operation',
})

@ApiForbiddenResponse({
    description: 'Successful operation',
})
```



### 分组

@ApiTags

用于控制器：

```typescript
@ApiTags('coffees')
```



### 定义描述

@ApiOperation()

用于方法：

```typescript
@ApiOperation({
    summary: '获取全部',
    description: '获取全部的coffee列表'
})
```



## 测试

- **单元测试**  注重于细节的实现。放在应用程序同级目录下，文件名必须为spec.ts - coffees.controller.sepc.ts

- **e2e测试**  注重于整个流程。放在专门的文件夹里，文件名必须为e2e-spec.ts -  app.e2e-spec.ts

Nest内置的Jest自动为我们拟定好了测试的命令：

```bash
npm run test # unit tests
npm run test:cov # coverage
npm run test:e2e # e2e tests
npm run test:watch -- coffees.service # 监控模式下测试指定文件
```



### 单元测试

#### 钩子函数

- `beforeEach` 这个钩子函数会在每一个当前域下每一个测试运行之前执行其内部的回调函数，通常用在测试的设置阶段
- `beforeAll`
- `afterEach`
- `afterAll`





#### 测试组件

- `Test`类有一个`createTestingModule`方法，接受一个ModuleMetadata对象作为它的参数，这与我们传递给@Module()装饰器的对象相同
- `compile`方法，引到模块及其依赖项，类似于我们在main.ts文件中引到应用程序的方式，返回一个TestingModule实例，让我们可以访问一些有用的方法，一旦TestingModule编译完成，
- `get`可以使用get方法来检索模块中声明的任何静态实例。





#### 隔离

```bash
npm run test:watch -- coffees.service

# 报错Nest can't resolve dependencies of the CoffeesServic... 这是由于我们很多依赖项没有引入到测试文件

```

> 为了修复错误，我们本应将所需的依赖添加到providers中，但是这会违反最佳实践和单元测试背后的理念：单元测试应该在-isonation-中执行。意思就是测试不应该依赖于外部依赖。





#### 引入依赖

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
...
beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            CoffeesService,
            { provide: Connection, useValue: {} },
            { provide: getRepositoryToken(Flavor), useValue: {} },
            { provide: getRepositoryToken(Coffee), useValue: {} },
        ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
});
```

> getRepositoryToken方法接受一个实体，返回一个InjectionToken，先给一个空对象作为value，测试开始时我们会用Mocks替换这些空对象



#### 实践

:chestnut: 测试findOne方法

> **分析：**
>
> - findOne方法中使用了coffeeRepository的findOne方法，所以要先模拟这个repo才行。
>
> - 代码中判断了coffee是否存在，所以起码我们需要两种不同场景来覆盖这个方法的测试

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID', () => {
      it('should return coffee', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });

    describe('otherwise', () => {
      it('should throw the NotFoundException', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee with id "${coffeeId}" not found`);
        }
      });
    });
  });
});

```



### e2e测试

e2e测试文件在test/app.e2e-spec.ts

> 用`createNestApplication`方法来实例化一个实际的Nest运行时环境，而不是像在单元测试中仍然使用service。
>
> 我们需要手动调用app.init()方法来初始化我们的应用程序，它将挂载我们所有的路由，触发生命周期钩子等。

```bash
npm run test:e2e
```

我们应该单独测试，而不是像示例那样运行一个真实的Nest实例，控制器，服务，等等都是真实实例化出来的。



#### 实践

:chestnut: 实现Coffee的e2e测试，测试CRUD

创建文件：/test/coffee

```typescript
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.todo('Create [POST /]');
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});

```



#### 模拟数据库

- 模拟数据库对象

- SQLite
- 创建测试数据库（推荐，和真实生产有相同的工作流）

使用docker创建测试数据库(要保证端口没有冲突)：

```bash
docker run -d --name nest-test-db -p 5433:5432 -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -e POSTGRES_PASSWORD=123456 postgres
```



#### 数据库自动连接与关闭（本地Docker）

package.json中添加test:e2e的钩子：

> pre 和 post 钩子
>
> 可以为脚本命令加上这两个钩子，以在命令执行前后分别执行其他命令

```bash
"pretest:e2e": "docker-compose up -d test-db",
"test:e2e": "jest --config ./test/jest-e2e.json",
"posttest:e2e": "docker-compose stop test-db && docker-compose rm -f test-db",
```



> 要用相对路径引入包，否则会在e2e测试时候报错

```typescript
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from '../../src/coffees/coffees.module';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: '101.35.103.3',
          port: 5433,
          username: 'postgres',
          password: '123456',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.todo('Create [POST /]');
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});

```



#### 实现CRUD测试

·

## MongoDB

文档存储在集合中而不是表中



### 创建数据库

```bash
docker run -d --name nest-mongo-db -p 27017:27017 -e MONGODB_DATABASE=mongodb mongo
```



### 安装依赖

```bash
npm install mongoose @nestjs/mongoose
npm install --save-dev @types/mongoose
```





### Model

负责从MongoDB中创建、读取和删除文档

要创建Mongoose model，要先定义一个Schema，每个Schema都映射到MongoDB的一个集合，并定义该集合中文档的结构

> schema 有两种 创建方式：
>
> - Nest装饰器 :+1:
> - Mongoose手动创建



### @Schema

```typescript
@Schema()
export class Coffee {
  name: string;
  price: number;
  flavors: Flavor[];
}
```

Mongo默认自动将所有的集合设为复数和小写，我们定义的Coffee会对应到coffees集合；Mongoose默认为模式添加下划线(_id)属性



### @Props定义属性

```typescript

```





### 注册

```typescript
// coffee.entity.ts 定义schema
@Schema()
export class Coffee extends Document {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop([String])
  flavors: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);

// coffees.module.ts 注册mongo
MongooseModule.forFeature([
    {
        name: Coffee.name,
        schema: CoffeeSchema,
    },
]),
```





### 实现CRUD



```typescript
import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Model } from 'mongoose';
import { log } from 'console';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
  ) {}

  findAll() {
    return this.coffeeModel.find().exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
    console.log('coffee', coffee);

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return existingCoffee;
  }

  async delete(id: string) {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }
}

```



### 分页

生成文件

```typescript
nest g class common/dto/pagination-query.dto --no-spec
```

```typescript
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}

```

```typescript
// controller.ts
@Get()
findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
}
```

```typescript
// service.ts
findAll(PaginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = PaginationQueryDto;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
}
```



### 事务

生成文件

```typescript
nest g class events/entities/event.entity --no-spec
```





## GraphQL

### 初体验

**安装依赖**

```bash
npm install @nestjs/graphql graphql-tools graphql apollo-server-express
```



**生成业务模块**

```bash
nest g module pets
nest g service pets
nest g resolver pets
```



**导入GraphQLModule**

```typescript
GraphQLModule.forRoot({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
}),
```



**创建实体**

```typescript
// pets.entity.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pet {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  type: string;
}

```

 

**模拟**

```typescript
// pets.service.ts
async findAll(): Promise<Pet[]> {
    const pet = new Pet();
pet.id = 1;
pet.name = 'Mambo';

return [pet];
}

// pets.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';
import { Pet } from './pets.entity';
import { PetsService } from './pets.service';

@Resolver((of) => Pet)
export class PetsResolver {
  constructor(private petsService: PetsService) {}

  @Query((returns) => [Pet])
  pets(): Promise<Pet[]> {
    return this.petsService.findAll();
  }
}
```

> 启动服务后，src目录下生成了一个schema.gql文件。访问 http://localhost:3000/graphql，可以看到定义好的schema

```typescript
{
  pets{
    name
  }
}

// output
{
  "data": {
    "pets": [
      {
        "name": "Mambo"
      }
    ]
  }
}
```



### 链接数据库

```bash
npm install @nestjs/typeorm typeorm pg
```



#### 引入依赖

```typescript
// app.module.ts
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






















































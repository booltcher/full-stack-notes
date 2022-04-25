import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './common/gurads/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
      transformOptions: {
        enableImplicitConversion: true, //隐式类型转换
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('CoffeesDoc')
    .setDescription('The coffees API description')
    .setVersion('1.0')
    .addTag('coffees')
    .build();

  const ducument = SwaggerModule.createDocument(app, options);
  // 参数： 1、挂载SwaggerUI的路由路径 2、应用程序 3、实例化的文档对象
  SwaggerModule.setup('api', app, ducument);

  await app.listen(3000);
}
bootstrap();

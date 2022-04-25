import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

// @Module({
//   providers: [
//     {
//       provide: 'CONNECTION',
//       useValue: createConnection({
//         // 由于使用了硬编码，我们不能轻易地在不同的模块共享，如果另一个应用想使用这个模块但要用不同的端口怎么办？这就是静态模块的短板

//         type: 'mysql',
//         host: 'localhost',
//         port: 3306,
//       }),
//     },
//   ],
// })
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

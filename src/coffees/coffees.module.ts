import { Module, Injectable, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { Connection } from 'typeorm';
import { DatabaseModule } from '../datebase/datebase.module';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// 从app.module.ts中删除CoffeesModule，以防被实例化两次
class MockCoffeeService {}

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable() // 注册为provider
export class CoffeeBrandsFactory {
  create() {
    return ['Starbucks', 'Dunkin Donuts'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    DatabaseModule.register({
      type: 'postgres',
      host: '123',
      port: 5432,
    }),
    CoffeesModule,
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  providers: [
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
    CoffeesService,
    // {
    //   provide: ConfigService,
    //   useClass:
    //     process.env.NODE_ENV === 'development'
    //       ? DevelopmentConfigService
    //       : ProductionConfigService,
    // },
  ],
})
export class CoffeesModule {}

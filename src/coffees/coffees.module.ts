import { Injectable, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsSchema } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';

@Injectable() // 注册为provider
export class CoffeeBrandsFactory {
  create() {
    return ['Starbucks', 'Dunkin Donuts'];
  }
}

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coffee.name,
        schema: CoffeeSchema,
      },
      {
        name: Event.name,
        schema: EventsSchema,
      },
    ]),

    CoffeesModule,
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}

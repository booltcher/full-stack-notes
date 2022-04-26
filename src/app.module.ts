import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule,
    MongooseModule.forRoot('mongodb://101.35.103.3:27017/nest-mongo-db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Model } from 'mongoose';
import { log } from 'console';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Connection } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    // console.log(coffeesConfiguration);
  }

  findAll(PaginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = PaginationQueryDto;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
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

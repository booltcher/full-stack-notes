import { Optional } from '@nestjs/common';
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

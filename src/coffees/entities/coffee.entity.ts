import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity() // sql table === "coffee"
export class Coffee {
  @PrimaryGeneratedColumn() //主键，自动增加值
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
  })
  flavors: Flavor[];

  @Column({ default: 0 })
  recommendations: number;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

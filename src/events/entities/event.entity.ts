import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Event extends mongoose.Document {
  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop(mongoose.SchemaTypes.Mixed) // 混合类型：意味着什么类型都可以
  payload: Record<string, any>;
}

export const EventsSchema = SchemaFactory.createForClass(Event);

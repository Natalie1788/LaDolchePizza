import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true }) // Добавляем createdAt и updatedAt
export class Pizza extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  ingredients: string[];

  @Prop()
  imageUrl?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
  comments: Types.ObjectId[];
}

// Создаем Mongoose-схему
export const PizzaSchema = SchemaFactory.createForClass(Pizza);

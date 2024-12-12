import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/*@Schema()
class PizzaOrder {
  @Prop({ type: Types.ObjectId, ref: 'Pizza', required: true }) // Указываем связь с моделью Pizza
  pizza: Types.ObjectId;

  @Prop({ type: Number, required: true }) // Количество пицц
  quantity: number;
}

const PizzaOrderSchema = SchemaFactory.createForClass(PizzaOrder);*/

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Связь с моделью User
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Pizza' }] })
  pizzas: Types.ObjectId[];

  @Prop({ required: true }) // Итоговая цена
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

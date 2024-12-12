import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

import { IsArray, IsMongoId } from 'class-validator';

export class UpdateOrderDto {
  @IsArray()
  @IsMongoId({ each: true }) // Проверка, что каждый элемент массива — валидный MongoID
  pizzas: string[];
}

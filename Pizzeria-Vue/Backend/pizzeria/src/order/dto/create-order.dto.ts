import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

/*class OrderItemDto {
  @IsMongoId() // Проверяет, что строка является валидным ObjectId
  @IsNotEmpty()
  pizzaId: string;


  @IsNumber()
  @IsPositive()
  quantity: number;
}*/

export class CreateOrderDto {
  @IsMongoId() // Проверяет, что строка является валидным ObjectId
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsMongoId({ each: true })
  pizzas: string[];

  @IsNumber()
  @IsPositive()
  totalPrice: number;
}

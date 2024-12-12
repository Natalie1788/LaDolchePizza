import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreatePizzaDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsOptional()
  ingredients?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  comments?: string[];
}

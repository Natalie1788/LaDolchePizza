import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  pizzaId: string;
}

/*export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsMongoId()
  @IsOptional()
  author?: string;

  @IsMongoId()
  @IsOptional()
  pizza?: string;
}*/

import {
  IsEmail,
  IsString,
  MinLength,
  IsArray,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateAuthDto {
  @MinLength(3, { message: 'Username must me 3 characters at lest' })
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must me 6 characters at lest' })
  @IsString()
  password: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  orders?: string[];
}

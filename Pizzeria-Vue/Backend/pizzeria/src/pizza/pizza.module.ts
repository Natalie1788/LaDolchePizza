import { Module, forwardRef } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pizza, PizzaSchema } from './entities/pizza.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';
//import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pizza.name, schema: PizzaSchema }]),
    //forwardRef(() => CommentModule), // Используем forwardRef для устранения циклической зависимости
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [PizzaController],
  providers: [PizzaService],
  exports: [PizzaService, MongooseModule],
})
export class PizzaModule {}

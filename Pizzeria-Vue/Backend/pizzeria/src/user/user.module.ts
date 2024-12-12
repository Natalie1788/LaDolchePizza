import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { UserSchema } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // Подключаем модель пользователя
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig, // Асинхронная конфигурация JWT
    }),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule], // Экспортируем сервис для использования в других модулях
})
export class UserModule {}

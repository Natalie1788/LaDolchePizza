import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PizzaModule } from './pizza/pizza.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { getMongodbConfig } from './config/mongo.config';
import { FileModule } from './file/file.module';
import { CommentModule } from './comment/comment.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    // Конфигурация для работы с переменными окружения
    ConfigModule.forRoot(),

    // Подключение к MongoDB через MongooseModule
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongodbConfig, // Используем ваш конфиг для MongoDB
    }),

    PizzaModule,
    UserModule,
    AuthModule,
    OrderModule,
    FileModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
//export class AppModule {}
export class AppModule implements OnModuleInit {
  // Используем интерфейс OnModuleInit для инициализации подключения
  async onModuleInit() {
    mongoose.connection.on('connected', () => {
      console.log('Successfully connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
    });

    // Пытаемся подключиться вручную для дополнительной отладки
    try {
      await mongoose.connect(process.env.MONGO_URI); // Здесь ваш URI или полученный через ConfigService
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }
}

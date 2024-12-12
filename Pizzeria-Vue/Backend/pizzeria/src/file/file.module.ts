import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Путь к папке с изображениями
      serveRoot: '/uploads', // Этот путь будет доступен по URL
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}

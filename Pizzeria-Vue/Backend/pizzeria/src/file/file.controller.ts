import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileResponse } from './file.service';
import { join } from 'path';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', new FileService().getMulterOptions('images')),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponse> {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }
    const savedFile = await this.fileService.saveFiles([file], 'images');
    return savedFile[0];
  }

  @Get('images/:fileName') // Запрос будет на /files/images/{fileName}
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', 'uploads', 'images', fileName); // Путь до файла в папке images

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    return res.sendFile(filePath); // Отправка файла в ответ
  }
}

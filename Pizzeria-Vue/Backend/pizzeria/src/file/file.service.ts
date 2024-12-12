import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { promises as fs } from 'fs';

export interface FileResponse {
  originalName: string;
  fileName: string;
  path: string;
}

@Injectable()
export class FileService {
  private createStorage(folder: string) {
    return diskStorage({
      destination: async (req, file, callback) => {
        const folderPath = join(__dirname, '..', 'uploads', folder);
        await fs.mkdir(folderPath, { recursive: true }); // Создаем папку, если её нет
        callback(null, folderPath);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName =
          file.fieldname + '-' + uniqueSuffix + extname(file.originalname);
        callback(null, fileName);
      },
    });
  }

  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default',
  ): Promise<FileResponse[]> {
    const responses: FileResponse[] = files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      path: `/uploads/${folder}/${file.filename}`,
    }));
    return responses;
  }

  getMulterOptions(folder: string) {
    return {
      storage: this.createStorage(folder),
      limits: {
        fileSize: 5 * 1024 * 1024, // Максимальный размер файла 5MB
      },
    };
  }
}

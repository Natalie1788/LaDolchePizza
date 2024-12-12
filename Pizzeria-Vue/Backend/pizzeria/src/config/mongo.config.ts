import { ConfigService } from '@nestjs/config';

export const getMongodbConfig = async (configService: ConfigService) => ({
  uri: configService.get<string>('MONGO_URI'),
});

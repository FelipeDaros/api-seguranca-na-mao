import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as moment from 'moment';

async function bootstrap() {
  moment.tz.setDefault('America/Sao_Paulo');
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  await app.listen(3000);
}
bootstrap();

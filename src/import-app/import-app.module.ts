import { Module } from '@nestjs/common';
import { ImportAppService } from './import-app.service';
import { ImportAppController } from './import-app.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ImportAppController],
  providers: [ImportAppService, PrismaService]
})
export class ImportAppModule {}

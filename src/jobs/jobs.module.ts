import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaService } from 'src/prisma.service';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService, GerarRondasService]
})
export class JobsModule {}

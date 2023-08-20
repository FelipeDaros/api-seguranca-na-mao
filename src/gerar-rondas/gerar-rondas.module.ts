import { Module } from '@nestjs/common';
import { GerarRondasService } from './gerar-rondas.service';
import { GerarRondasController } from './gerar-rondas.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [GerarRondasController],
  providers: [GerarRondasService, PrismaService],
  exports: [GerarRondasService]
})
export class GerarRondasModule {}

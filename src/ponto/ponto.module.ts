import { Module } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoController } from './ponto.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PontoController],
  providers: [PontoService, PrismaService],
})
export class PontoModule {}

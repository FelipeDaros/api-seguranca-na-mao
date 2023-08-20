import { Module } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { PrismaService } from 'src/prisma.service';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';

@Module({
  controllers: [AlertaController],
  providers: [AlertaService, PrismaService, GerarRondasService]
})
export class AlertaModule {}

import { Module } from '@nestjs/common';
import { EquipamentosPostoService } from './equipamentos-posto.service';
import { EquipamentosPostoController } from './equipamentos-posto.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EquipamentosPostoController],
  providers: [EquipamentosPostoService, PrismaService],
})
export class EquipamentosPostoModule {}

import { Module } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service';
import { EquipamentosController } from './equipamentos.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EquipamentosController],
  providers: [EquipamentosService, PrismaService],
})
export class EquipamentosModule {}

import { Module } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { ServicoController } from './servico.controller';
import { PrismaService } from 'src/prisma.service';
import { ChecklistService } from 'src/checklist/checklist.service';

@Module({
  controllers: [ServicoController],
  providers: [ServicoService, PrismaService, ChecklistService],
})
export class ServicoModule {}

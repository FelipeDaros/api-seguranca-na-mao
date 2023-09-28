import { Module } from '@nestjs/common';
import { ConfiguracoesService } from './configuracoes.service';
import { ConfiguracoesController } from './configuracoes.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ConfiguracoesController],
  providers: [ConfiguracoesService, PrismaService]
})
export class ConfiguracoesModule {}

import { Module } from '@nestjs/common';
import { PanicoService } from './panico.service';
import { PanicoController } from './panico.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PanicoController],
  providers: [PanicoService, PrismaService],
})
export class PanicoModule {}

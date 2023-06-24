import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { PostoController } from './posto.controller';
import { PostoService } from './posto.service';

@Module({
  controllers: [PostoController],
  providers: [PostoService, PrismaService],
})
export class Posto {}

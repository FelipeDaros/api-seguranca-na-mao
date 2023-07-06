import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService, PrismaService],
  exports: [ChecklistService],
})
export class ChecklistModule {}

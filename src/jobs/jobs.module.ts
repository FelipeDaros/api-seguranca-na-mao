import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaService } from 'src/prisma.service';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService, GerarRondasService, PushNotificationsService]
})
export class JobsModule {}

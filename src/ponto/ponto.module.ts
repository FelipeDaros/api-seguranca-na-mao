import { Module } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoController } from './ponto.controller';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [PontoController],
  providers: [PontoService, PrismaService, MailService],
  exports: [PontoService]
})
export class PontoModule {}

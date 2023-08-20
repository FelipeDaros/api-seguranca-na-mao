import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService, MailService],
  exports: [UsuariosService]
})
export class UsuariosModule {}

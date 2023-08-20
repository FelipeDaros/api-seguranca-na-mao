import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PontoService } from 'src/ponto/ponto.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  public async enviarEmailPontoCriado(data?: any): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: 'segurancanamao@gmail.com',
        from: 'felipe-daros@hotmail.com',
        subject: 'Ponto criado para empresa',
        text: 'O ponto foi criado para a empresa',
        html: '<span>Foi criado</span>'
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async enviarEmailUsuarioCriado({nome, email, isAdmin, senha}: Usuario): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: 'segurancanamao@gmail.com',
        from: 'felipe-daros@hotmail.com',
        subject: `Usuário criado ${nome}`,
        text: 'Usuário criado',
        html: `<div>Usuario: ${nome} - Senha: ${senha}</div>`
      })
      return;
    } catch (error) {
      throw new BadRequestException("Erro ao enviar email");
    }
  }
}

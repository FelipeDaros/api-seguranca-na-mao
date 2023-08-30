import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { emailRegex } from 'src/utils/emailRegex';
import * as moment from 'moment';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private readonly prismaService: PrismaService, private readonly mailService: MailService) { }

  public async create(user: CreateUsuarioDto) {
    const usuarioExiste = await this.prismaService.usuario.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!emailRegex(user.email.trim())) {
      throw new BadRequestException('O endereço de email fornecido não é válido');
    }

    if (usuarioExiste) {
      throw new BadRequestException('Usuario já existe na base');
    }

    try {
      const usuario = await !this.prismaService.usuario.create({
        data: {
          nome: user.email.toLowerCase(),
          email: user.email.toLowerCase().trim(),
          senha: user.senha.toLowerCase(),
          posto_id: user.posto_id,
          empresa_id: user.empresa_id,
          ultimoLogin: new Date(),
          created_at: moment().add(-3, 'hours').toDate(),
          estaLogado: false,
          tipo_usuario: user.tipo_usuario.toUpperCase()
        },
      });

      await this.mailService.enviarEmailUsuarioCriado(user);

      return usuario;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException('Erro ao cadastrar usuário', { cause: new Error(), description: error });
    }
  }

  public async findAll(empresa_id: number) {
    const usuarios = await this.prismaService.usuario.findMany({
      where: {
        empresa_id
      }
    });

    return usuarios;
  }

  public async findOne(id: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
    });
    if (!usuario) {
      throw new NotFoundException('Não foi possível encontrar o usuário com esse id', { cause: new Error(), description: 'Não foi possível encontrar o usuário com esse id' });
    }
    return usuario;
  }

  public async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      let user = await this.findOne(id);

      user = {
        ...user,
        ...updateUsuarioDto
      }

      await this.prismaService.usuario.update({
        where: {
          id
        },
        data: user
      });

      return user;
    } catch (error) {
      console.log(error)
      throw new NotFoundException('Erro ao atualizar o usuário', { cause: new Error(), description: error });
    }
  }

  public async remove(id: string): Promise<void> {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new BadRequestException(
        'Não foi possível encontrar o usuário com esse id',
      );
    }

    await this.prismaService.usuario.delete({
      where: {
        id,
      },
    });

    return;
  }

  public async adicionarHoraAlertAoUsuario(id: string): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    user.horario_alerta = moment().add(-3, 'hours').toDate();

    await this.prismaService.usuario.update({
      where: {
        id
      },
      data: user
    });

    return;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { emailRegex } from 'src/utils/emailRegex';
import * as moment from 'moment';

@Injectable()
export class UsuariosService {
  constructor(private readonly prismaService: PrismaService, private readonly mailService: MailService) { }

  public async create({ email, nome, senha, posto_id, empresa_id }: CreateUsuarioDto) {
    const usuarioExiste = await this.prismaService.usuario.findFirst({
      where: {
        email,
      },
    });

    if(!emailRegex(email)){
      throw new BadRequestException('O endereço de email fornecido não é válido');
    }

    if (usuarioExiste) {
      throw new BadRequestException('Usuario já existe na base');
    }

    try {
      const usuario = await this.prismaService.usuario.create({
        data: {
          nome: nome.toLowerCase(),
          email: email.toLowerCase(),
          senha: senha.toLowerCase(),
          posto_id,
          empresa_id,
          ultimoLogin: new Date(),
          created_at: moment().add(-3, 'hours').toDate(),
          estaLogado: false,
        },
      });
      
      // await this.mailService.enviarEmailUsuarioCriado(usuario);

      return usuario;
    } catch (error) {
      throw new BadRequestException();
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
      throw new BadRequestException(
        'Não foi possível encontrar o usuário com esse id',
      );
    }
    return usuario;
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
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
}

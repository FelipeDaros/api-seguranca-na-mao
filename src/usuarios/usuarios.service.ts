import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({ email, nome, senha }: CreateUsuarioDto) {
    const usuarioExiste = await this.prismaService.usuario.findFirst({
      where: {
        email,
      },
    });

    if (usuarioExiste) {
      throw new BadRequestException('Usuario já existe na base');
    }

    const usuario = await this.prismaService.usuario.create({
      data: {
        nome,
        email,
        senha,
        ultimoLogin: new Date(),
        created_at: new Date(),
        estaLogado: false,
      },
    });

    return usuario;
  }

  public async findAll() {
    const usuarios = await this.prismaService.usuario.findMany();

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

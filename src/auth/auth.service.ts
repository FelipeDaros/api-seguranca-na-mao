import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dto/loginPayload.dto';
import { PayloadUser } from './dto/payload-user-dto';
import { horarioAtualConfigurado } from 'src/utils/datetime';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  public async login({ senha, nome }: LoginDto) {
    const user = await this.prismaService.usuario.findFirst({
      where: {
        nome,
        senha,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    user.ultimoLogin = horarioAtualConfigurado();

    await this.prismaService.usuario.update({
      where: {
        id: user.id
      },
      data: user
    });

    const configs = await this.prismaService.configuracoes.findMany({
      where: {
        usuario_id: user.id
      }
    });

    return {
      token: await this.jwtService.signAsync({
        ...new LoginPayload(user),
      }),
      user: new PayloadUser(user),
      configuracao: configs
      // acessToken: await this.jwtService.signAsync(),
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dto/loginPayload.dto';
import { PayloadUser } from './dto/payload-user-dto';

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

    return {
      token: await this.jwtService.signAsync({
        ...new LoginPayload(user),
      }),
      user: new PayloadUser(user),
      // acessToken: await this.jwtService.signAsync(),
    };
  }
}

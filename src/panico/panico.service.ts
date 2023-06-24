import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePanicoDto } from './dto/create-panico.dto';
import { Panico } from '@prisma/client';

@Injectable()
export class PanicoService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create({
    usuario_id,
    verificado,
  }: CreatePanicoDto): Promise<CreatePanicoDto> {
    const panico = await this.prismaService.panico.create({
      data: {
        usuario_id,
        verificado,
      },
    });

    return panico;
  }

  public async update(id: number): Promise<void> {
    await this.prismaService.panico.update({
      where: {
        id,
      },
      data: {
        verificado: true,
      },
    });
    return;
  }

  public async findAll(): Promise<Panico[]> {
    return await this.prismaService.panico.findMany();
  }
}

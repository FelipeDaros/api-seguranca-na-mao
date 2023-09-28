import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePanicoDto } from './dto/create-panico.dto';
import { Panico } from '@prisma/client';
import * as moment from 'moment';


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
        created_at: moment().add(-3, 'hours').toDate()
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

  public async findAllEmpresa(id: number): Promise<Panico[]>{
    return await this.prismaService.panico.findMany({
      where: {
        empresa_id: id
      }
    })
  }
}

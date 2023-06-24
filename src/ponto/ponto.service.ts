import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UpdatePontoDto } from './dto/update-ponto.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PontoService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({ latitude, longitude, nome, posto_id }: CreatePontoDto) {
    const pontoExistente = await this.prismaService.ponto.findFirst({
      where: {
        nome: nome.toLowerCase(),
        posto_id,
      },
    });

    if (pontoExistente) {
      throw new BadRequestException('Ponto existente no posto.');
    }

    const ponto = await this.prismaService.ponto.create({
      data: { latitude, longitude, nome: nome.toLowerCase(), posto_id },
    });

    return ponto;
  }

  public async findAll() {
    return `This action returns all ponto`;
  }

  public async findOne(id: number) {
    return `This action returns a #${id} ponto`;
  }

  public async update(id: number, updatePontoDto: UpdatePontoDto) {
    return `This action updates a #${id} ponto`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} ponto`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ServicoService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({
    empresa_id,
    posto_id,
    relatorio_lido,
    usuario_id,
  }: CreateServicoDto) {
    const servico = await this.prismaService.servico.create({
      data: {
        empresa_id,
        posto_id,
        usuario_id,
        relatorioLido: relatorio_lido,
      },
    });

    return servico;
  }

  public async findAll() {
    return `This action returns all servico`;
  }

  public async findOne(id: number) {
    return `This action returns a #${id} servico`;
  }

  public async update(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} servico`;
  }
}

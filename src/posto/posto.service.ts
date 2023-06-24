import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostoServicoDto } from './dto/create-posto-servico.dto';
import { UpdatePostoServicoDto } from './dto/update-posto-servico.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostoService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create({
    nome,
    empresa_id,
    equipaments,
  }: CreatePostoServicoDto) {
    const postoServico = await this.prismaService.posto.findFirst({
      where: {
        nome,
        empresa_id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    const postoServicoCreated = await this.prismaService.posto.create({
      data: {
        nome,
        empresa_id,
      },
    });

    for await (const equipament of equipaments) {
      await this.prismaService.equipamentosPosto.create({
        data: {
          equipamento_id: equipament,
          posto_id: postoServicoCreated.id,
        },
      });
    }

    return postoServicoCreated;
  }

  public async findAll(empresa_id: number) {
    const postosServicos = await this.prismaService.posto.findMany({
      where: {
        empresa_id,
      },
    });

    return postosServicos;
  }

  public async findOne(id: number) {
    const postoServico = await this.prismaService.posto.findFirst({
      where: {
        id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    return postoServico;
  }

  public async update(
    id: number,
    updatePontoServicoDto: UpdatePostoServicoDto,
  ) {
    const postoServico = await this.prismaService.posto.findFirst({
      where: {
        id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    const postoServicoAlterado = await this.prismaService.posto.update({
      where: {
        id,
      },
      data: updatePontoServicoDto,
    });

    return postoServicoAlterado;
  }

  public async remove(id: number) {
    const postoServico = await this.prismaService.posto.findFirst({
      where: {
        id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    await this.prismaService.posto.delete({
      where: {
        id,
      },
    });

    return;
  }
}

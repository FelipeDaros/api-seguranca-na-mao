import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PrismaService } from 'src/prisma.service';
import { ChecklistService } from 'src/checklist/checklist.service';
import { Servico } from '@prisma/client';

@Injectable()
export class ServicoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly checklistService: ChecklistService,
  ) {}
  public async create({
    empresa_id,
    posto_id,
    relatorio_lido,
    usuario_id,
    equipamentos_post_id,
  }: CreateServicoDto): Promise<Servico> {
    const servico = await this.prismaService.servico.create({
      data: {
        empresa_id,
        posto_id,
        usuario_id,
        relatorioLido: relatorio_lido,
      },
    });

    await this.checklistService.create({
      equipamentos_post_id,
      posto_id,
      servico_id: servico.id,
      usuario_id,
    });

    const servicoCriado = {
      ...servico,
      equipamentos_post_id,
    };

    return servicoCriado;
  }

  public async findAll(): Promise<Array<Servico>> {
    const servicos = await this.prismaService.servico.findMany({
      include: {
        Checklist: {
          include: {
            EquipamentosPosto: true
          }
        },
        // Empresa: true,
        // User: true,
        // Posto: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return servicos;
  }

  public async buscarRelatorioUltimoVigilanteDoPosto(posto_id: number) {
    const servico = await this.prismaService.servico.findFirst({
      where: {
        posto_id,
      },
      orderBy: {
        id: 'desc',
      },
    });

    if (!servico) {
      throw new BadRequestException('Não foi localizado o último serviço');
    }

    const buscarEquipametosDoSerico =
      await this.prismaService.checklist.findMany({
        where: {
          servico_id: servico.id,
        },
        include: {
          EquipamentosPosto: {
            include: {
              Equipamentos: true,
            },
          },
        },
      });

    const relatorio = {
      servico,
      buscarEquipametosDoSerico,
    };

    return relatorio;
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

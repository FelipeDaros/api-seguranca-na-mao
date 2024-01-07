import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PrismaService } from 'src/prisma.service';
import { ChecklistService } from 'src/checklist/checklist.service';
import { Servico } from '@prisma/client';
import { EquipamentosPostoService } from 'src/equipamentos-posto/equipamentos-posto.service';
import { horarioAtualConfigurado } from 'src/utils/datetime';

@Injectable()
export class ServicoService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  public async create({
    empresa_id,
    posto_id,
    relatorio_lido,
    usuario_id,
    equipamentos_id,
  }: CreateServicoDto): Promise<Servico> {
    const servico = await this.prismaService.servico.create({
      data: {
        empresa_id,
        posto_id,
        usuario_id,
        relatorioLido: relatorio_lido,
      },
    });

    equipamentos_id.forEach(async (id) => {
      await this.prismaService.equipamentosServico.create({
        data: {
          servico_id: servico.id,
          equipamento_id: id,
          created_at: horarioAtualConfigurado()
        }
      });
    });

    return servico;
  }

  public async findAll(): Promise<Array<Servico>> {
    const servicos = await this.prismaService.servico.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return servicos;
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

  public async findLatestServicePost(posto_id: number): Promise<any> {
    const servico = await this.prismaService.servico.findFirst({
      where: {
        posto_id
      },
      orderBy: {
        id: 'desc'
      },
      include: {
        Posto: {
          select: {
            nome: true,
            id: true
          }
        },
        User: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    if (!servico) {
      return;
    }

    const equipamentosServico = await this.prismaService.equipamentosServico.findMany({
      where: {
        servico_id: servico.id
      }
    });

    const ids = equipamentosServico.map(item => item.equipamento_id);

    const equipamentos = await this.prismaService.equipamentos.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    const servicoData = {
      ...servico,
      equipamentos
    }

    return servicoData;
  }

  public async buscarInformacoesFinishDay(user_id: string){
    const servico = await this.prismaService.servico.findFirst({
      where: {
        usuario_id: user_id
      },
      orderBy: {
        id: 'desc'
      }
    });

    const equipamentosServico = await this.prismaService.equipamentosServico.findMany({
      where: {
        servico_id: servico.id
      }
    });

    const ids = equipamentosServico.map(item => item.equipamento_id);

    const equipamentos = await this.prismaService.equipamentos.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    const alertas = await this.prismaService.alerta.findMany({
      
    });

    const finishDayInfo = {
      ...servico,
      equipamentos
    }
  } 
}

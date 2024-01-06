import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipamentosPostoDto } from './dto/create-equipamentos-posto.dto';
import { UpdateEquipamentosPostoDto } from './dto/update-equipamentos-posto.dto';
import { PrismaService } from 'src/prisma.service';
import { Equipamentos } from '@prisma/client';

@Injectable()
export class EquipamentosPostoService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({
    equipamento_id,
    posto_id,
  }: CreateEquipamentosPostoDto) {
    for await (const equipamento of equipamento_id) {
      const equipamentoPostoExistente =
        await this.prismaService.equipamentosPosto.findFirst({
          where: {
            equipamento_id: equipamento,
            posto_id,
          },
        });

      if (equipamentoPostoExistente) {
        throw new BadRequestException('Equipamento já cadastrado ao posto');
      }

      await this.prismaService.equipamentosPosto.create({
        data: {
          equipamento_id: equipamento,
          posto_id,
        },
      });
    }
  }

  public async findAll(posto_id: number): Promise<Equipamentos[]> {
    const equipamentosPosto =
      await this.prismaService.equipamentosPosto.findMany({
        where: {
          posto_id,
        },
      });

    const ids = equipamentosPosto.map(item => item.equipamento_id);

    const equipamentos = await this.prismaService.equipamentos.findMany({
      where: {
        id: {
          in: ids
          }
        }
      });

    return equipamentos;
  }

  public async findOne(id: number) {
    const equipamentoPosto =
      await this.prismaService.equipamentosPosto.findMany({
        where: {
          id,
        },
        include: {
          Equipamentos: {
            select: {
              id: true,
              nome: true,
            }
          }
        }
      });

    if (!equipamentoPosto) {
      throw new BadRequestException('Equipamento do posto não localizado');
    }

    return equipamentoPosto;
  }

  public async update(
    id: number,
    updateEquipamentosPostoDto: UpdateEquipamentosPostoDto,
  ) {
    const equipamentoPosto =
      await this.prismaService.equipamentosPosto.findMany({
        where: {
          id,
        },
      });

    if (!equipamentoPosto) {
      throw new BadRequestException('Equipamento do posto não localizado');
    }

    const equipamentoPostoAlterado =
      await this.prismaService.equipamentosPosto.update({
        where: {
          id,
        },
        data: {
          equipamento_id: updateEquipamentosPostoDto.equipamento_id[0],
          posto_id: updateEquipamentosPostoDto.posto_id,
        },
      });

    return equipamentoPostoAlterado;
  }

  public async remove(id: number) {
    const equipamentoPosto =
      await this.prismaService.equipamentosPosto.findMany({
        where: {
          id,
        },
      });

    if (!equipamentoPosto) {
      throw new BadRequestException('Equipamento do posto não localizado');
    }

    await this.prismaService.equipamentosPosto.delete({
      where: {
        id,
      },
    });

    return;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EquipamentosService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create(createEquipamentoDto: CreateEquipamentoDto) {
    for await (const equipamento of createEquipamentoDto.nome) {
      const equipamentoExistente =
        await this.prismaService.equipamentos.findFirst({
          where: {
            nome: equipamento,
          },
        });

      if (equipamentoExistente) {
        throw new BadRequestException(
          'Equipamento já cadastrado na plataforma!',
        );
      }

      await this.prismaService.equipamentos.create({
        data: {
          nome: equipamento,
        },
      });
    }
  }

  public async findAll() {
    const equipamentos = await this.prismaService.equipamentos.findMany();

    return equipamentos;
  }

  public async findOne(id: number) {
    const equipamento = await this.prismaService.equipamentos.findUnique({
      where: {
        id,
      },
    });

    if (!equipamento) {
      throw new BadRequestException('Equipamento não foi localizado na base');
    }

    return equipamento;
  }

  public async update(id: number, updateEquipamentoDto: UpdateEquipamentoDto) {
    const equipamento = await this.prismaService.equipamentos.findUnique({
      where: {
        id,
      },
    });

    if (!equipamento) {
      throw new BadRequestException('Equipamento não foi localizado na base');
    }

    for await (const equipa of updateEquipamentoDto.nome) {
      await this.prismaService.equipamentos.update({
        where: {
          id,
        },
        data: equipa,
      });
    }
  }

  public async remove(id: number) {
    const equipamento = await this.prismaService.equipamentos.findUnique({
      where: {
        id,
      },
    });

    if (!equipamento) {
      throw new BadRequestException('Equipamento não foi localizado na base');
    }

    return await this.prismaService.equipamentos.delete({
      where: equipamento,
    });
  }
}

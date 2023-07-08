import { Injectable } from '@nestjs/common';
import { CreateGerarRondaDto } from './dto/create-gerar-ronda.dto';
import { UpdateGerarRondaDto } from './dto/update-gerar-ronda.dto';
import { PrismaService } from 'src/prisma.service';
import * as moment from 'moment-timezone';
@Injectable()
export class GerarRondasService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(usuario_id: string): Promise<void> {
    // eslint-disable-next-line no-var
    var data_criacao = moment().toDate();
    // eslint-disable-next-line no-var
    var repeticoes = 0;
    const { posto_id } = await this.prismaService.usuario.findUnique({
      where: {
        id: usuario_id,
      },
    });

    const pontos = await this.prismaService.ponto.findMany({
      where: {
        posto_id,
      },
    });

    for await (const posto of pontos) {
      repeticoes = repeticoes + 1;
      const horario = moment(data_criacao).add(-3, 'h').toDate();
      await this.prismaService.gerarRondas.create({
        data: {
          posto_id: posto.id,
          usuario_id,
          maximo_horario: moment(horario)
            .add(repeticoes * 15, 'm')
            .toDate(),
        },
      });
    }

    return;
  }

  findAll() {
    return `This action returns all gerarRondas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gerarRonda`;
  }

  update(id: number, updateGerarRondaDto: UpdateGerarRondaDto) {
    return `This action updates a #${id} gerarRonda`;
  }

  remove(id: number) {
    return `This action removes a #${id} gerarRonda`;
  }
}

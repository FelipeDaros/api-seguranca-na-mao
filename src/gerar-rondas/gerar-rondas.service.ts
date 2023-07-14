import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGerarRondaDto } from './dto/create-gerar-ronda.dto';
import { UpdateGerarRondaDto } from './dto/update-gerar-ronda.dto';
import { PrismaService } from 'src/prisma.service';
import * as moment from 'moment-timezone';
import { GerarRondas } from '@prisma/client';
@Injectable()
export class GerarRondasService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(usuario_id: string): Promise<void> {
    let repeticoes = 0;
    const verificado = await this.verificarTodosVerificadosUsuario(usuario_id);

    if (!verificado) {
      throw new BadRequestException('Você precisa felizar sua ronda iniciada');
    }

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

    for await (const ponto of pontos) {
      repeticoes = repeticoes + 1;
      await this.prismaService.gerarRondas.create({
        data: {
          posto_id,
          ponto_id: ponto.id,
          usuario_id,
          maximo_horario: moment()
            .add(repeticoes * 15, 'm')
            .toDate(),
        },
      });
    }

    return;
  }

  public async buscarRondasAoResposavel(usuario_id: string): Promise<any[]> {
    const rondas = await this.prismaService.gerarRondas.findMany({
      where: {
        usuario_id,
        verificado: false,
      },
      include: {
        Ponto: true,
        Posto: true,
      },
    });

    return rondas;
  }

  public async verificarRondaSelecionada(id: number): Promise<GerarRondas> {
    const rondaSelecionada = await this.prismaService.gerarRondas.findUnique({
      where: {
        id,
      },
    });

    const rondaAlterada: GerarRondas = {
      ...rondaSelecionada,
      verificado: true,
    };

    if (moment().toDate() >= rondaAlterada.maximo_horario) {
      rondaAlterada.atrasado = true;
    }

    const data = await this.prismaService.gerarRondas.update({
      data: rondaAlterada,
      where: {
        id,
      },
    });

    return data;
  }

  findAll() {
    return `This action returns all gerarRondas`;
  }

  public async findOne(id: number): Promise<GerarRondas> {
    const ronda = await this.prismaService.gerarRondas.findUnique({
      where: {
        id,
      },
    });

    return ronda;
  }

  update(id: number, updateGerarRondaDto: UpdateGerarRondaDto) {
    return `This action updates a #${id} gerarRonda`;
  }

  remove(id: number) {
    return `This action removes a #${id} gerarRonda`;
  }

  private async verificarTodosVerificadosUsuario(
    usuario_id: string,
  ): Promise<boolean> {
    const rondasNaoVerificadas = await this.prismaService.gerarRondas.findMany({
      where: {
        usuario_id,
        verificado: false,
      },
    });

    if (!rondasNaoVerificadas.length) {
      return true;
    }

    return false;
  }
}

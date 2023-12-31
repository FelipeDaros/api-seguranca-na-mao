import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOcorrenciaDto, Fotos } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { PrismaService } from 'src/prisma.service';
import { randomUUID } from 'crypto';
@Injectable()
export class OcorrenciaService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({
    dataOcorrencia,
    descricao,
    usuario_id,
    titulo,
    fotos
  }: CreateOcorrenciaDto) {
    try {
      const createOcorrencia =
        await this.prismaService.registroOcorrencia.create({
          data: {
            dataOcorrencia,
            descricao,
            possuiFoto: false,
            usuario_id,
            titulo,
            status: 'ABERTO',
          },
        });

      fotos.forEach(async (foto: Fotos) => {
        await this.prismaService.fotosOcorrencia.create({
          data: {
            nomeArquivo: randomUUID(),
            registro_ocorrencia_id: createOcorrencia.id,
            url: foto.base64,
            base64: foto.base64
          }
        })
      });   
      return createOcorrencia;
    } catch (error) {
      throw new BadRequestException('Não foi possível salvar a ocorrência');
    }
  }

  public async findAll() {
    try {
      const occorrencias = await this.prismaService.registroOcorrencia.findMany(
        {
          include: { FotosOcorrencia: true, User: true },
        },
      );

      return occorrencias;
    } catch (error) {
      return error;
    }
  }

  public async findOne(id: number) {
    const ocorrencia = await this.prismaService.registroOcorrencia.findUnique({
      where: {
        id,
      },
      include: {
        FotosOcorrencia: true,
        User: true,
      },
    });

    if (!ocorrencia) {
      throw new BadRequestException('Ocorrência não encontrada');
    }

    return ocorrencia;
  }

  public async updateStatus(
    id: number,
    updateOcorrenciaDto: UpdateOcorrenciaDto,
  ): Promise<string> {
    const ocorrencia = await this.prismaService.registroOcorrencia.findUnique({
      where: {
        id,
      },
    });

    if (!ocorrencia) {
      throw new BadRequestException('Ocorrência não encontrada');
    }

    await this.prismaService.registroOcorrencia.update({
      where: { id },
      data: updateOcorrenciaDto,
    });

    return `Ocorrência com o título ${ocorrencia.titulo} finalizada com sucesso!`;
  }

  public async remove(id: number): Promise<void> {
    const ocorrencia = await this.prismaService.registroOcorrencia.findUnique({
      where: {
        id,
      },
    });

    if (!ocorrencia) {
      throw new BadRequestException('Ocorrência não encontrada');
    }

    await this.prismaService.registroOcorrencia.delete({
      where: { id },
    });

    return;
  }
}

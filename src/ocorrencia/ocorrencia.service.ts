import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OcorrenciaService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({
    dataOcorrencia,
    descricao,
    fotos,
    usuario_id,
    titulo,
  }: CreateOcorrenciaDto) {
    const possuiFoto = fotos.length >= 1;
    try {
      const createOcorrencia =
        await this.prismaService.registroOcorrencia.create({
          data: {
            dataOcorrencia,
            descricao,
            possuiFoto,
            usuario_id,
            titulo,
            status: 'ABERTO',
          },
        });

      for await (const foto of fotos) {
        await this.prismaService.fotosOcorrencia.create({
          data: {
            nomeArquivo: foto.filename,
            registro_ocorrencia_id: createOcorrencia.id,
            url: foto.path,
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Não foi possível salvar a ocorrência');
    }
  }

  public async findAll() {
    const occorrencias = await this.prismaService.registroOcorrencia.findMany({
      include: { FotosOcorrencia: true, User: true },
    });

    return occorrencias;
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

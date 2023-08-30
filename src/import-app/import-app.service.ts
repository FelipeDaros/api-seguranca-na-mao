import { BadRequestException, Injectable } from '@nestjs/common';
import { Ponto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ImportAppService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    public async bucsarPontosParaImportacao(empresa_id: number): Promise<Ponto[]> {
        const pontos = await this.prismaService.ponto.findMany({
            where: {
                Posto: {
                    empresa_id
                }
            }
        });

        if (!pontos.length) {
            throw new BadRequestException('Não existe pontos nessa empresa');
        }

        return pontos;
    }
}

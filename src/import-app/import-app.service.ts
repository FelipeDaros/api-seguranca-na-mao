import { BadRequestException, Injectable } from '@nestjs/common';
import { Ponto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { SincronizarRondasAppDto } from './dto/sincronizar-rondas-app-dto';

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


    public async sincronizarRondas({ atrasado, maximo_horario, ponto_id, posto_id, user_id, verificado, cancelado, motivo }: SincronizarRondasAppDto) {
        try {
            await this.prismaService.gerarRondas.create({
                data: {
                    atrasado,
                    ponto_id,
                    posto_id,
                    usuario_id: user_id,
                    verificado,
                    maximo_horario,
                    cancelado,
                    motivo
                }
            });
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    public async finishDay(id: string) {
        try {
            const finishDay = await this.prismaService.usuario.findUnique({
                where: {
                    id
                },
                include: {
                    Alerta: true,
                    GerarRondas: true,
                    Checklist: true
                }
            });

            return finishDay
        } catch (error) {

        }
    }
}

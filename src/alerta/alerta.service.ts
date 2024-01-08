import { BadRequestException, Injectable } from '@nestjs/common';
import { Alerta, GerarRondas } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import 'moment/locale/pt-br';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';
import { horarioAtualConfigurado } from 'src/utils/datetime';

@Injectable()
export class AlertaService {
    constructor(private readonly prismaService: PrismaService, private readonly gerarRondasService: GerarRondasService) { }

    public async create(usuario_id: string, servico_id: number): Promise<Alerta> {
        try {
            const alerta = await this.prismaService.alerta.create({
                data: {
                    usuario_id,
                    servico_id,                
                    created_at: horarioAtualConfigurado()
                }
            });

            return alerta;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
    
    public async buscarRondasEmAbertoUsuarioAntesDeEmitirAlerta(usuario_id: string): Promise<GerarRondas[]>{
        const rondas = await this.prismaService.gerarRondas.findMany({
            where: {
                verificado: false,
                usuario_id
            }
        });

        return rondas;
    }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { Alerta, GerarRondas } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as momentTime from 'moment-timezone';
import 'moment/locale/pt-br';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';

@Injectable()
export class AlertaService {
    constructor(private readonly prismaService: PrismaService, private readonly gerarRondasService: GerarRondasService) { }

    public async create(usuario_id: string): Promise<Alerta> {
        try {
            let gerarRondas = false;
            let countAlertasRecentes = 0;
            const agora = momentTime().add(-3, 'hours').toDate();
            const ultimosAlertas = await this.prismaService.alerta.findMany({
                where: {
                    usuario_id
                },
                take: 4,
                orderBy: {
                    created_at: 'desc'
                }
            });
    
            const validarRondasEmAberto = await this.prismaService.gerarRondas.findMany({
                where: {
                    usuario_id,
                    verificado: false
                }
            });

            const usuario = await this.prismaService.usuario.findUnique({
                where: {
                    id: usuario_id
                }
            });

            if(validarRondasEmAberto.length){
                throw new BadRequestException('Você possui rondas em aberto. Para prosseguir, finalize-as.', { cause: new Error(), description: 'Você possui rondas em aberto. Para prosseguir, finalize-as.' });
            }

            let ultimaRondaHaUmaHoraAtras = momentTime(agora).diff(usuario?.ultima_ronda, 'minutes');
    
            ultimosAlertas.forEach(item => {
                const diffEmMinutos = momentTime(agora).diff(momentTime(item.created_at).toDate(), 'minutes');

                if (diffEmMinutos <= 60) { 
                    countAlertasRecentes++; 
                }
            });
            
            if (countAlertasRecentes >= 3) {
                gerarRondas = true;
            }

            if(!ultimaRondaHaUmaHoraAtras && ultimaRondaHaUmaHoraAtras !== 0){
                ultimaRondaHaUmaHoraAtras = 60;
            }

            if(gerarRondas && ultimaRondaHaUmaHoraAtras >= 60){
                await this.gerarRondasService.create(usuario_id);

                usuario.ultima_ronda = agora;

                await this.prismaService.usuario.update({
                    data: usuario,
                    where: {
                        id: usuario_id
                    }
                })
            }

            const alerta = await this.prismaService.alerta.create({
                data: {
                    usuario_id,
                    created_at: momentTime().add(-3, 'hours').toDate()
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

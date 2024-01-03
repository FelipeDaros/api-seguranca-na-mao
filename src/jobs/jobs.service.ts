import { Injectable } from '@nestjs/common';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';
import { PrismaService } from 'src/prisma.service';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { addHorario, horarioAtual, horarioAtualConfigurado } from 'src/utils/datetime';
import * as moment from 'moment';

@Injectable()
export class JobsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly pushNotificationsService: PushNotificationsService,
        private readonly gerarRondasService: GerarRondasService
    ) { }

    public async buscarRotasEmAberto() {
        const rondas = await this.prismaService.gerarRondas.findMany({
            where: {
                verificado: false
            },
            include: {
                User: true
            }
        });
        const usuarios = rondas.map(item => item.User);

        return rondas;
    }

    public async gerarRondas() {
        const usuarios = await this.prismaService.usuario.findMany({
            where: {
                tipo_usuario: 'VIGILANTE'
            },
            include: {
                Configuracoes: true
            }
        });
        
        usuarios.forEach(async (usuario) => {
            const horario = horarioAtualConfigurado();
            
            const rondasEmAberto = await this.prismaService.gerarRondas.findMany({
                where: {
                    usuario_id: usuario.id,
                    verificado: false
                }
            });
            
            if (!!rondasEmAberto && rondasEmAberto.length) {
                return;
            }

            const diferenca = moment(horario).diff(usuario.ultimoLogin, 'hours');
            
            if (diferenca >= 12) {
                return;
            }

            const config = usuario.Configuracoes.find(config => config?.tipo === 'RONDA');
            
            if (!config) {
                return;
            }

            const diffUltimaRonda = usuario?.ultima_ronda ? moment(horario).diff(usuario?.ultima_ronda, config.parametro as any) : 60;

            if (Number(diffUltimaRonda) < Number(config.valor)) {
                return;
            }
            
            await this.gerarRondasService.create(usuario.id);

            await this.pushNotificationsService.sendNotificationsRondasCreated(usuario);

            usuario.ultima_ronda = horarioAtualConfigurado();

            await this.prismaService.usuario.update({
                data: {
                    ultima_ronda: usuario.ultima_ronda
                },
                where: {
                    id: usuario.id
                }
            });
        });
    }
}

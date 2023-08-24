import { Injectable } from '@nestjs/common';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';
import { PrismaService } from 'src/prisma.service';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { uniq } from "ramda";

@Injectable()
export class JobsService {
    constructor(
        private readonly prismaService: PrismaService, 
        private readonly pushNotificationsService: PushNotificationsService
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

        await this.pushNotificationsService.sendNotificationsRondasEmAberto(uniq(usuarios));

        return rondas;
    }
}

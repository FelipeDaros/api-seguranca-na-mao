import { Injectable } from '@nestjs/common';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JobsService {
    constructor(private readonly prismaService: PrismaService, private readonly gerarRondasService: GerarRondasService){}

}

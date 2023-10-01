import { Injectable } from '@nestjs/common';
import { Alerta } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RelatorioAlertaDto } from './dto/RelatorioAlerta.dto';

@Injectable()
export class RelatoriosService {
  constructor(
    private readonly prismaService: PrismaService
  ){}
  public async buscarAlertas({data_final, data_inicio, empresa_id, tudo, usuario_id}: RelatorioAlertaDto): Promise<Alerta[]>{

    if(!!tudo){
      return await this.prismaService.alerta.findMany({
        where: {
          User: {
            empresa_id
          },
          created_at: {
            gt: data_inicio,
            lt: data_final
          }
        }
      });
    }

    if(!tudo){
      return await this.prismaService.alerta.findMany({
        where: {
          User: {
            empresa_id,
            id: usuario_id
          },
          created_at: {
            gt: data_inicio,
            lt: data_final
          }
        }
      });
    }
  }
}

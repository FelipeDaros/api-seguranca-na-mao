import { Controller, Param, Post } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { Alerta } from '@prisma/client';

@Controller('alerta')
export class AlertaController {
  constructor(private readonly alertaService: AlertaService) {}

  @Post(':usuario_id')
  public async create(@Param('usuario_id') usuario_id: string): Promise<Alerta>{
    const alerta = await this.alertaService.create(usuario_id);

    return alerta;
  }
}

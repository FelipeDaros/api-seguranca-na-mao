import { Controller, Get, Param, Post } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { Alerta, GerarRondas } from '@prisma/client';

@Controller('alerta')
export class AlertaController {
  constructor(private readonly alertaService: AlertaService) {}

  @Post(':usuario_id')
  public async create(@Param('usuario_id') usuario_id: string): Promise<Alerta>{
    const alerta = await this.alertaService.create(usuario_id);

    return alerta;
  }

  @Get(':usuario_id')
  public async buscarRondasEmAbertoUsuarioAntesDeEmitirAlerta(@Param('usuario_id') usuario_id: string): Promise<GerarRondas[]>{
    const rondas = await this.alertaService.buscarRondasEmAbertoUsuarioAntesDeEmitirAlerta(usuario_id);

    return rondas;
  }
  
}

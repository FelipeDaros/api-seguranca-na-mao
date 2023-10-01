import { Body, Controller, Get } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { RelatorioAlertaDto } from './dto/RelatorioAlerta.dto';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get( )
  public async buscarAlertas(@Body() relatorioAlertaDto: RelatorioAlertaDto){
    return await this.relatoriosService.buscarAlertas(relatorioAlertaDto);
  }
}

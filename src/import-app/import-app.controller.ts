import { Controller, Get, Param } from '@nestjs/common';
import { ImportAppService } from './import-app.service';
import { Ponto } from '@prisma/client';

@Controller('import-app')
export class ImportAppController {
  constructor(private readonly importAppService: ImportAppService) { }

  @Get(':empresa_id')
  public async bucsarPontosParaImportacao(@Param('empresa_id') empresa_id: string): Promise<Ponto[]> {
    return await this.importAppService.bucsarPontosParaImportacao(+empresa_id);
  }
}

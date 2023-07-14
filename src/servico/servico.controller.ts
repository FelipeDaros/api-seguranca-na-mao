import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { Servico } from '@prisma/client';

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @Post()
  public async create(
    @Body() createServicoDto: CreateServicoDto,
  ): Promise<Servico> {
    return this.servicoService.create(createServicoDto);
  }

  @Get()
  public async findAll(): Promise<Array<Servico>> {
    return await this.servicoService.findAll();
  }

  @Get('/buscar-relatorio-ultimo-vigilante-do-posto/:posto_id')
  public async buscarRelatorioUltimoVigilanteDoPosto(
    @Param('posto_id') posto_id: string,
  ) {
    return await this.servicoService.buscarRelatorioUltimoVigilanteDoPosto(
      +posto_id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicoService.update(+id, updateServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicoService.remove(+id);
  }
}

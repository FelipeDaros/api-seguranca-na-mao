import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GerarRondasService } from './gerar-rondas.service';
import { CreateGerarRondaDto } from './dto/create-gerar-ronda.dto';
import { UpdateGerarRondaDto } from './dto/update-gerar-ronda.dto';

@Controller('gerar-rondas')
export class GerarRondasController {
  constructor(private readonly gerarRondasService: GerarRondasService) {}

  @Post(':usuario_id')
  public async create(@Param('usuario_id') usuario_id: string): Promise<void> {
    return await this.gerarRondasService.create(usuario_id);
  }

  @Get()
  findAll() {
    return this.gerarRondasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gerarRondasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGerarRondaDto: UpdateGerarRondaDto,
  ) {
    return this.gerarRondasService.update(+id, updateGerarRondaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gerarRondasService.remove(+id);
  }
}

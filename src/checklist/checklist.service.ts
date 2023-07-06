import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChecklistService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({
    equipamentos_post_id,
    servico_id,
    usuario_id,
    posto_id,
  }: CreateChecklistDto) {
    try {
      for await (const equipamento of equipamentos_post_id) {
        await this.prismaService.checklist.create({
          data: {
            equipamentos_post_id: equipamento,
            servico_id,
            usuario_id,
            posto_id,
          },
        });
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

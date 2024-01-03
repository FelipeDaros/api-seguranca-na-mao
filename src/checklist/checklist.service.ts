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

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

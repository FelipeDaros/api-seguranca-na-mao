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

  public async findAll() {
    const checklists = await this.prismaService.checklist.findMany();

    return checklists;
  }

  public async findOne(id: number) {
    const checklist = await this.prismaService.checklist.findFirst({
      where: {
        id,
      },
    });

    return checklist;
  }

  update(id: number, updateChecklistDto: UpdateChecklistDto) {
    return `This action updates a #${id} checklist`;
  }

  remove(id: number) {
    return `This action removes a #${id} checklist`;
  }
}

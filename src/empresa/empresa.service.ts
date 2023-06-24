import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmpresaService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({ cidade, estado, nome }: CreateEmpresaDto) {
    const empresa = await this.prismaService.empresa.findFirst({
      where: {
        nome,
      },
    });

    if (empresa) {
      throw new BadRequestException('Empresa já existeste');
    }

    const empresaSalva = await this.prismaService.empresa.create({
      data: {
        cidade,
        estado,
        nome,
      },
    });

    return empresaSalva;
  }

  public async findAll() {
    const empresas = await this.prismaService.empresa.findMany();

    return empresas;
  }

  public async findOne(id: number) {
    return `This action returns a #${id} empresa`;
  }

  public async update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
}

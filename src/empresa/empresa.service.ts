import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmpresaService {
  constructor(private readonly prismaService: PrismaService) { }
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
    const empresa = await this.prismaService.empresa.findUnique({
      where: {
        id
      }
    });

    if (!empresa) {
      throw new BadRequestException('Empresa não foi localizada.');
    }

    return empresa;
  }

  public async update(id: number, updateEmpresaDto: UpdateEmpresaDto): Promise<UpdateEmpresaDto> {
    const empresa = await this.prismaService.empresa.findFirst({
      where: {
        nome: updateEmpresaDto.nome
      },
    });

    if (empresa) {
      throw new BadRequestException('Empresa já existeste com esse nome');
    }

    return await this.prismaService.empresa.update({
      where: {
        id
      },
      data: updateEmpresaDto
    });
  }

  public async remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
}

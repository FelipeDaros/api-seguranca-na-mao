import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UpdatePontoDto } from './dto/update-ponto.dto';
import { PrismaService } from 'src/prisma.service';
import PDFDocumentWithTables from 'pdfkit-table';
import * as QRCODE from 'qrcode';
import * as fs from 'fs-extra';

@Injectable()
export class PontoService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create({ latitude, longitude, nome, posto_id }: CreatePontoDto) {
    const pontoExistente = await this.prismaService.ponto.findFirst({
      where: {
        nome: nome.toLowerCase(),
        posto_id,
      },
    });

    if (pontoExistente) {
      throw new BadRequestException('Ponto existente no posto.');
    }

    const ponto = await this.prismaService.ponto.create({
      data: { latitude, longitude, nome: nome.toLowerCase(), posto_id },
    });

    return ponto;
  }

  public async findAllWithPagination() {
    const data = await this.prismaService.ponto.findMany();

    return data;
  }

  public async generarPDF(id: number): Promise<Buffer> {
    const { nome } = await this.prismaService.ponto.findUnique({
      where: {
        id,
      },
    });

    if (!nome) {
      throw new BadRequestException('Não foi possível localizar o ponto');
    }

    // Gerar e salvar a imagem do QR Code
    await this.gerarQRCode(nome);

    // Gerar o PDF com o QR Code
    const pdfBuffer: Buffer = await this.gerarPDFComQRCode(nome);

    return pdfBuffer;
  }

  private async gerarQRCode(nome: string): Promise<void> {
    try {
      await QRCODE.toFile(`./src/qrcode/${nome}.png`, nome);
    } catch (err) {
      throw new Error('Erro ao gerar o código QR: ' + err.message);
    }
  }

  private async gerarPDFComQRCode(nome: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const doc = new PDFDocumentWithTables({
        size: 'LETTER',
        bufferPages: true,
      });

      //todo
      doc.text(`QRCODE gerado do ponto ${nome}`);
      doc.moveDown();

      try {
        const bufferImagemQRCode = await fs.readFile(
          `./src/qrcode/${nome}.png`,
        );
        doc.image(bufferImagemQRCode, 50, 150, { width: 500, height: 500 });
      } catch (err) {
        reject(new Error('Erro ao ler o arquivo QR Code: ' + err.message));
      }

      doc.text('Cole exatamente onde você gerou o ponto');

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });
  }

  public async findAll() {
    return `This action returns all ponto`;
  }

  public async findOne(id: number) {
    return `This action returns a #${id} ponto`;
  }

  public async update(id: number, updatePontoDto: UpdatePontoDto) {
    return `This action updates a #${id} ponto`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} ponto`;
  }
}

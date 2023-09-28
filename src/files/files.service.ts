import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FilesService {
    constructor(private readonly prismaService: PrismaService){

    }

    public async uploadSingleFile(file: Buffer){}

    public async multipleFile(){}
}

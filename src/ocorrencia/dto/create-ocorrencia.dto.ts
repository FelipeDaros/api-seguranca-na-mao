export class CreateOcorrenciaDto {
  descricao: string;
  titulo: string;
  usuario_id: string;
  dataOcorrencia: Date;
  fotos?: Express.Multer.File[];
}

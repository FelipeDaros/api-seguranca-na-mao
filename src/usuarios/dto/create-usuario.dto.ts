import { Usuario } from '../../../node_modules/prisma/prisma-client/index';

export class CreateUsuarioDto {
  nome: string;
  senha: string;
  email: string;
}

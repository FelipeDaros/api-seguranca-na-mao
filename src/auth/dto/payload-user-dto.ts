import { Usuario } from '@prisma/client';

export class PayloadUser {
  id: string;
  nome: string;
  email: string;
  created_at: Date;
  ultimoLogin: Date;

  constructor(user: Usuario) {
    this.id = user.id;
    this.nome = user.nome;
    this.email = user.email;
    this.created_at = user.created_at;
    this.ultimoLogin = user.ultimoLogin;
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { Posto } from './posto/posto.module';
import { EquipamentosPostoModule } from './equipamentos-posto/equipamentos-posto.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ServicoModule } from './servico/servico.module';
import { PanicoModule } from './panico/panico.module';
import { PontoModule } from './ponto/ponto.module';
import { OcorrenciaModule } from './ocorrencia/ocorrencia.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsuariosModule,
    EquipamentosModule,
    Posto,
    EquipamentosPostoModule,
    EmpresaModule,
    ChecklistModule,
    ServicoModule,
    PanicoModule,
    PontoModule,
    OcorrenciaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

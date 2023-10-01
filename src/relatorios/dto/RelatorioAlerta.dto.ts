import { IsBoolean, IsDate, IsDateString, IsEmpty, IsNumber, IsString } from "class-validator";

export class RelatorioAlertaDto {

  @IsString()
  usuario_id?: string;

  @IsBoolean()
  tudo: boolean;

  @IsNumber()
  empresa_id: number;

  @IsDateString()
  data_inicio: Date;

  @IsDateString()
  data_final: Date;
}
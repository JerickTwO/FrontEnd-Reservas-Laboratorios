import { DiaEnum } from './laboratorio.model';
import { Laboratorio } from './laboratorio.model';
import { Periodo } from './periodo.model';
import { TipoEnum } from './tipoEnum.model';

export interface HorarioReservas {
    id: number;
    nombreDocente: string;
    correoDocente: string;
    laboratorio: Laboratorio;
    periodo: Periodo;
    nombreMateria?: string;
    motivo?: string;
    horaInicio: string;
    horaFin: string;
    dia: DiaEnum;
    tipo: TipoEnum;
}
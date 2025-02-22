import { DiaEnum } from './laboratorio.model';
import { Laboratorio } from './laboratorio.model';
import { TipoEnum } from './tipoEnum.model';

export interface HorarioReservas {
    id: number;
    nombreDocente: string;
    correoDocente: string;
    laboratorio: Laboratorio;
    nombreMateria?: string;
    motivo?: string;
    horaInicio: string;
    horaFin: string;
    dia: DiaEnum;
    tipo: TipoEnum;
}
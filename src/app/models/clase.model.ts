import { Materia } from './materia.model';
import { Docente } from './docente.model';
import { Periodo } from './periodo.model';
import { DiaEnum } from './laboratorio.model';

export class Clase {
  idClase: number;
  materia: Materia;
  docente: Docente;
  periodo: Periodo;
  horaInicio: string;
  horaFin: string;
  dia: DiaEnum;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  constructor() {
    this.idClase = 0;
    this.materia = new Materia();
    this.docente = new Docente();
    this.periodo = new Periodo();
    this.horaInicio = '';
    this.horaFin = '';
    this.dia = DiaEnum.LUNES;
    this.fechaCreacion = new Date();
    this.fechaActualizacion = new Date();
  }
}

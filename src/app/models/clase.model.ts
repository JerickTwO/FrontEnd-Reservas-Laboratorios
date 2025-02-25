import { Materia } from './materia.model';
import { Docente } from './docente.model';
import type { Periodo } from './periodo.model';
import { DiaEnum, Laboratorio } from './laboratorio.model';

export class Clase {
  idClase: number;
  materia: Materia;
  docente: Docente;
  laboratorio: Laboratorio;
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
    this.laboratorio = new Laboratorio();
    this.horaInicio = '';
    this.horaFin = '';
    this.dia = DiaEnum.LUNES;
    this.fechaCreacion = new Date();
    this.fechaActualizacion = new Date();
  }
}

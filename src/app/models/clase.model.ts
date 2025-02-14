import { Materia } from './materia.model';
import { Docente } from './docente.model';
import { Periodo } from './periodo.model';

export class Clase {
  idClase: number;
  materia: Materia;
  docente: Docente;
  periodo: Periodo;

  constructor() {
    this.idClase = 0;
    this.materia = new Materia();
    this.docente = new Docente();
    this.periodo = new Periodo();
  }
}

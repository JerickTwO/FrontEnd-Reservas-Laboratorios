import { Docente } from './docente.model';

export class Materia {
  idMateria: number;
  nombreMateria: string;
  nrc: string;
  docente: Docente; // Relación con el modelo Docente

  constructor() {
    this.idMateria = 0;
    this.nombreMateria = '';
    this.nrc = '';
    this.docente = new Docente();
  }
}
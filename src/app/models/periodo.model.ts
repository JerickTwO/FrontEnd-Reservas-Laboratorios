import { Carrera } from './carrera.model';

export class Periodo {
  idPeriodo: number;
  nombrePeriodo: string;
  descripcion: string;
  carrera: Carrera; // Relación con Carrera

  constructor() {
    this.idPeriodo = 0;
    this.nombrePeriodo = '';
    this.descripcion = '';
    this.carrera = new Carrera(); // Inicializa el objeto de Carrera
  }
}

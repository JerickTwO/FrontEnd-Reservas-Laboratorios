export class Periodo {
  idPeriodo: number;
  nombrePeriodo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  descripcion: string;

  constructor() {
    this.nombrePeriodo = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.estado = false;
    this.descripcion = '';
  }
}

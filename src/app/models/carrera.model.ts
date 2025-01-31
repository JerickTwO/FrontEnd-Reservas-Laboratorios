export class Carrera {
  idCarrera: number | null;
  nombreCarrera: string;
  descripcion: string;

  constructor(idCarrera: number | null = null, nombreCarrera: string = '', descripcion: string = '') {
    this.idCarrera = idCarrera;
    this.nombreCarrera = nombreCarrera;
    this.descripcion = descripcion;
  }
}

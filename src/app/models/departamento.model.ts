export class Departamento {
  idDepartamento: number;
  nombreDepartamento: string;
  descripcion: string;

  constructor(
    idDepartamento: number = 0,
    nombreDepartamento: string = '',
    descripcion: string = ''
  ) {
    this.idDepartamento = idDepartamento;
    this.nombreDepartamento = nombreDepartamento;
    this.descripcion = descripcion;
  }
}

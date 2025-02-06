import { Carrera } from './carrera.model';

export class Estudiante {
  idEstudiante: number;
  nombreEstudiante: string;
  apellidoEstudiante: string;
  correoEstudiante: string;
  idInstitucional: string;
  carrera: Carrera; // Relación con el modelo Carrera

  constructor() {
    this.idEstudiante = 0;
    this.nombreEstudiante = '';
    this.apellidoEstudiante = '';
    this.correoEstudiante = '';
    this.idInstitucional = '';
    this.carrera = new Carrera(); // Inicializa como un objeto vacío
  }
}

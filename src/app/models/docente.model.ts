import { Departamento } from './departamento.model';

export class Docente {
  idDocente: number;
  nombreDocente: string;
  apellidoDocente: string;
  correoDocente: string;
  idInstitucional: string;
  departamento: Departamento; 
  
  constructor() {
    this.idDocente = 0;
    this.nombreDocente = '';
    this.apellidoDocente = '';
    this.correoDocente = '';
    this.idInstitucional = '';
    this.departamento = new Departamento();
  }
}

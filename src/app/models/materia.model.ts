export class Materia {
  idMateria: number;
  nombreMateria: string;
  nrc: string;
  creditos: number; // Nuevo atributo para almacenar los créditos de la materia

  constructor() {
    this.idMateria = 0;
    this.nombreMateria = '';
    this.nrc = '';
    this.creditos = 0; // Inicializa los créditos con 0
  }
}

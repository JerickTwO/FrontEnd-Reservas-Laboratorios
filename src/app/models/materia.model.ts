export interface Materia {
    idMateria: number;
    nombreMateria: string;
    nrc: string;
    docente: Docente;
  }
  
  export interface Docente {
    idDocente: number;
    nombreDocente: string;
    apellidoDocente: string;
    correoDocente: string;
    idInstitucional: string;
    departamento: Departamento;
  }
  
  export interface Departamento {
    idDepartamento: number;
    nombreDepartamento: string;
    descripcion: string;
  }
  
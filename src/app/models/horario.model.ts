export interface Horario {
  id?: number;  // Agregado para evitar errores en actualizaciones
  fecha: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  clase: {
    idClase: number;
    materia?: { idMateria: number; nombre: string };
    docente?: { nombreDocente: string };
    periodo?: { nombrePeriodo: string };
  };
  laboratorio: { idLaboratorio: number; nombreLaboratorio: string };
}

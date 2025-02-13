export interface Horario {
  idHorario?: number; // ID único del horario
  dia: string; // Día (e.g., "LUNES")
  horaInicio: string; // Hora de inicio (e.g., "07:00")
  horaFin: string; // Hora de fin (e.g., "09:00")
  materia?: {
    idMateria?: number;
    nombreMateria?: string;
  };
  docente?: {
    idDocente?: number;
    nombreDocente?: string;
  };
  laboratorio?: {
    idLaboratorio?: number;
    nombreLaboratorio?: string;
  };
}

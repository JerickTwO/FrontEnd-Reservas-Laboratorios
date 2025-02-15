import { Reserva } from "./reserva.model";
export interface Horario {
  idHorario?: number; // ID único del horario
  dia: string; // Día (e.g., "LUNES")
  horaInicio: string; // Hora de inicio (e.g., "07:00")
  horaFin: string; // Hora de fin (e.g., "09:00")
  reserva?: Reserva; 
}

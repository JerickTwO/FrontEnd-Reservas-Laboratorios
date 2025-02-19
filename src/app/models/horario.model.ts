import { Reserva } from "./reserva.model";
export interface Horario {
  idHorario?: number; // ID único del horario
  reserva?: Reserva; 
}

import { DiaEnum, Laboratorio } from "./laboratorio.model";
export class Reserva {
  idReserva: number; // Opcional en caso de creación
  nombreCompleto: string;
  correo: string;
  telefono: string;
  materia?: string;
  ocupacionLaboral: string;
  laboratorio: Laboratorio;
  dia: DiaEnum;
  horaInicio: string;
  horaFin: string;
  motivoReserva: string;
  cantidadParticipantes: number;
  requerimientosTecnicos?: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  fechaActualizacion?: Date;
}

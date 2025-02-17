import { Laboratorio } from "./laboratorio.model";
export class Reserva {
  idReserva: number; // Opcional en caso de creación
  nombreCompleto: string;
  correo: string;
  telefono: string;
  ocupacionLaboral: string;
  laboratorio: Laboratorio;
  dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';
  horaInicio: string;
  horaFin: string;
  motivoReserva: string;
  cantidadParticipantes: number;
  requerimientosTecnicos?: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'; // Estado tipado con valores permitidos
}

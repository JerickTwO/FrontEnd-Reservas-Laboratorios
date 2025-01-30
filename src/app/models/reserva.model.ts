export class Reserva {
    idReserva: number;
    nombreCompleto: string;
    correo: string;
    telefono: string;
    ocupacionLaboral: string;
    laboratorio: Laboratorio;
    horaInicio: string;
    horaFin: string;
    motivoReserva: string;
    cantidadParticipantes: number;
    requerimientosTecnicos: string;
    estado: string;
} export interface Laboratorio {
    idLaboratorio: number;
    nombreLaboratorio: string;
    ubicacion: string;
    capacidad: number;
}

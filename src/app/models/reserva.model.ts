export class Reserva {
    id?: number; // La propiedad ID debe existir, y el '?' indica que es opcional
    nombreCompleto: string;
    correo: string;
    telefono: string;
    ocupacionLaboral: string;
    laboratorio: { idLaboratorio: number; nombreLaboratorio: string };
    horaInicio: string;
    horaFin: string;
    motivoReserva: string;
    cantidadParticipantes: number;
    estado: string;
}

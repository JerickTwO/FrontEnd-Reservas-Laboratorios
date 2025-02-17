export class Laboratorio {
    idLaboratorio: number;
    nombreLaboratorio: string;
    capacidad: number;
    ubicacion: string;
    franjasHorario: string[];

    constructor(
        idLaboratorio: number,
        nombreLaboratorio: string,
        capacidad: number,
        ubicacion: string,
        franjasHorario: string[]
    ) {
        this.idLaboratorio = idLaboratorio;
        this.nombreLaboratorio = nombreLaboratorio;
        this.capacidad = capacidad;
        this.ubicacion = ubicacion;
        this.franjasHorario = franjasHorario;
    }
}

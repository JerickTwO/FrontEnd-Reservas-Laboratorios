export class Laboratorio {
    idLaboratorio: number;
    nombreLaboratorio: string;
    capacidad: number;
    ubicacion: string;
    franjasHorario: string[];
    diasHorario: string[];

    constructor(
        idLaboratorio: number,
        nombreLaboratorio: string,
        capacidad: number,
        ubicacion: string,
        franjasHorario: string[],
        diasHorario: string[]
    ) {
        this.idLaboratorio = idLaboratorio;
        this.nombreLaboratorio = nombreLaboratorio;
        this.capacidad = capacidad;
        this.ubicacion = ubicacion;
        this.franjasHorario = franjasHorario;
        this.diasHorario = diasHorario;
    }
}

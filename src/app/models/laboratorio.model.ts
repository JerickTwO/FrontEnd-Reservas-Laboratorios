export enum DiaEnum {
    LUNES = 'LUNES',
    MARTES = 'MARTES',
    MIERCOLES = 'MIERCOLES',
    JUEVES = 'JUEVES',
    VIERNES = 'VIERNES',
}
export class Laboratorio {
    idLaboratorio: number;
    nombreLaboratorio: string;
    capacidad: number;
    ubicacion: string;
    franjasHorario: string[];
    diasHorario: DiaEnum[];

    constructor() {
        this.idLaboratorio = 0;
        this.nombreLaboratorio = '';
        this.capacidad = 0;
        this.ubicacion = '';
        this.franjasHorario = [];
        this.diasHorario = [];
    }
}


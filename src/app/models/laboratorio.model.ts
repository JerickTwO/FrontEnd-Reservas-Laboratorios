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
    constructor(
        idLaboratorio: number,
        nombreLaboratorio: string,
        capacidad: number,
        ubicacion: string,
        franjasHorario: [],
    ) {
        this.idLaboratorio = idLaboratorio;
        this.nombreLaboratorio = nombreLaboratorio;
        this.capacidad = capacidad;
        this.ubicacion = ubicacion;
        this.franjasHorario = franjasHorario;
        this.diasHorario = [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES];
    }
}

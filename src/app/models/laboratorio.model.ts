export class Laboratorio {
    idLaboratorio: number;
    nombreLaboratorio: string;
    capacidad: number;
    ubicacion: string;

    constructor(data?: Partial<Laboratorio>) {
        this.idLaboratorio = data?.idLaboratorio || 0;
        this.nombreLaboratorio = data?.nombreLaboratorio || '';
        this.capacidad = data?.capacidad || 0;
        this.ubicacion = data?.ubicacion || '';
    }
}

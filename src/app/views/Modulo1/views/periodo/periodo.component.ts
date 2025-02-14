import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarreraService } from 'src/app/core/services/carrera.service';
import { PeriodoService } from 'src/app/core/services/periodo.service';
import { Carrera } from 'src/app/models/carrera.model';
import { Periodo } from 'src/app/models/periodo.model';

@Component({
    selector: 'app-periodo',
    standalone: true,
    templateUrl: './periodo.component.html',
    imports: [FormsModule, CommonModule],
})
export class PeriodoComponent implements OnInit {

    periodos: Periodo[] = [];
    periodo: Periodo = new Periodo();
    carreras: Carrera[] = [];
    isEditing = false;
    currentId: number | null = null;

    constructor(private periodoService: PeriodoService, private carreraService: CarreraService) { }

    ngOnInit(): void {
        this.obtenerPeriodos();
        this.obtenerCarreras();
    }

    obtenerPeriodos(): void {
        this.periodoService.getPeriodos().subscribe((data) => {
            this.periodos = data;
        });
    }

    obtenerCarreras(): void {
        // Aquí podrías tener un servicio para obtener las carreras
        this.carreraService.getCarreras().subscribe((data) => {
            this.carreras = data;
        });
    }

    guardar(): void {
        if (this.isEditing) {
            this.periodoService.editarPeriodo(this.currentId!, this.periodo).subscribe(() => {
                this.obtenerPeriodos();
                this.resetForm();
            });
        } else {
            this.periodoService.agregarPeriodo(this.periodo).subscribe(() => {
                this.obtenerPeriodos();
                this.resetForm();
            });
        }
    }

    editar(id: number): void {
        this.periodoService.getPeriodoById(id).subscribe((data) => {
            this.periodo = data;
            this.currentId = id;
            this.isEditing = true;
        });
    }

    eliminar(id: number): void {
        this.periodoService.eliminarPeriodo(id).subscribe(() => {
            this.obtenerPeriodos();
        });
    }

    resetForm(): void {
        this.periodo = new Periodo();
        this.isEditing = false;
        this.currentId = null;
    }
}

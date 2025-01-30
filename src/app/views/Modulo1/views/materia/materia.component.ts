import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MateriaService } from 'src/app/core/services/materia.service';
import { Materia } from 'src/app/models/materia.model';

@Component({
  selector: 'app-materia',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './materia.component.html',
})
export class MateriaComponent implements OnInit {
  materias: Materia[] = [];
  isModalOpen = false;
  nuevaMateria: Materia = {
    idMateria: 0,
    nombreMateria: '',
    nrc: '',
    docente: {
      idDocente: 0,
      nombreDocente: '',
      apellidoDocente: '',
      correoDocente: '',
      idInstitucional: '',
      departamento: {
        idDepartamento: 0,
        nombreDepartamento: '',
        descripcion: '',
      },
    },
  };

  constructor(private materiaService: MateriaService) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  obtenerMaterias(): void {
    this.materiaService.getMaterias().subscribe({
      next: (data) => (this.materias = data),
      error: (error) => console.error('Error al obtener materias', error),
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  agregarMateria(): void {
    this.materiaService.createMateria(this.nuevaMateria).subscribe({
      next: (nueva) => {
        this.materias.push(nueva);
        this.closeModal();
      },
      error: (error) => console.error('Error al agregar materia', error),
    });
  }
}

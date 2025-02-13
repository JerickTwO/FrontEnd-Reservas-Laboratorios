import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocenteService } from 'src/app/core/services/docente.service';
import { HorarioService } from 'src/app/core/services/horario.service';
import { MateriaService } from 'src/app/core/services/materia.service';
import { Docente } from 'src/app/models/docente.model';
import { Horario } from 'src/app/models/horario.model';
import { Laboratorio } from 'src/app/models/laboratorio.model';
import { Materia } from 'src/app/models/materia.model';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit{
  dias: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  horas: string[] = ['07:00-09:00', '09:00-11:00', '11:00-13:00', '13:30-15:30'];
  horarios: Horario[] = [];
  materias: Materia[] = [];
  docentes: Docente[] = [];
  laboratorios: Laboratorio[] = []; // Nueva lista de laboratorios
  modalVisible: boolean = false;

  modalHorario: {
    dia: string;
    hora: string;
    idMateria: number;
    idDocente: number;
    idLaboratorio: number; // Agregado para el laboratorio
  } = {
    dia: '',
    hora: '',
    idMateria: 0,
    idDocente: 0,
    idLaboratorio: 0,
  };

  constructor(
    private horarioService: HorarioService,
    private materiaService: MateriaService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.cargarHorarios();
    this.cargarMaterias();
    this.cargarDocentes();
    this.cargarLaboratorios(); // Cargar laboratorios
  }

  cargarHorarios(): void {
    this.horarioService.obtenerHorarios().subscribe(
      (data: Horario[]) => {
        this.horarios = data;
      },
      (error: any) => {
        console.error('Error al cargar los horarios:', error);
      }
    );
  }

  cargarMaterias(): void {
    this.materiaService.getMaterias().subscribe(
      (data: Materia[]) => {
        this.materias = data;
      },
      (error: any) => {
        console.error('Error al cargar las materias:', error);
      }
    );
  }

  cargarDocentes(): void {
    this.docenteService.getDocentes().subscribe(
      (data: Docente[]) => {
        this.docentes = data;
      },
      (error: any) => {
        console.error('Error al cargar los docentes:', error);
      }
    );
  }

  cargarLaboratorios(): void {
    // Suponiendo que tienes un servicio para obtener laboratorios
    this.horarioService.getLaboratorios().subscribe(
      (data: Laboratorio[]) => {
        this.laboratorios = data;
      },
      (error: any) => {
        console.error('Error al cargar los laboratorios:', error);
      }
    );
  }

  abrirModal(hora: string, dia: string): void {
    const horarioExistente = this.horarios.find(
      (h) => h.dia === dia && `${h.horaInicio}-${h.horaFin}` === hora
    );

    this.modalHorario = horarioExistente
      ? {
          dia: dia,
          hora: hora,
          idMateria: horarioExistente.materia?.idMateria || 0,
          idDocente: horarioExistente.docente?.idDocente || 0,
          idLaboratorio: horarioExistente.laboratorio?.idLaboratorio || 0,
        }
      : {
          dia: dia,
          hora: hora,
          idMateria: 0,
          idDocente: 0,
          idLaboratorio: 0,
        };

    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  guardarCambios(): void {
    const horarioExistente = this.horarios.find(
      (h) =>
        h.dia === this.modalHorario.dia &&
        `${h.horaInicio}-${h.horaFin}` === this.modalHorario.hora
    );

    if (horarioExistente) {
      horarioExistente.materia = {
        idMateria: this.modalHorario.idMateria,
        nombreMateria: this.materias.find((m) => m.idMateria === this.modalHorario.idMateria)
          ?.nombreMateria || '',
      };
      horarioExistente.docente = {
        idDocente: this.modalHorario.idDocente,
        nombreDocente: this.docentes.find((d) => d.idDocente === this.modalHorario.idDocente)
          ?.nombreDocente || '',
      };
      horarioExistente.laboratorio = {
        idLaboratorio: this.modalHorario.idLaboratorio,
        nombreLaboratorio: this.laboratorios.find((l) => l.idLaboratorio === this.modalHorario.idLaboratorio)
          ?.nombreLaboratorio || '',
      };

      this.horarioService.actualizarHorario(horarioExistente).subscribe(() => {
        console.log('Horario actualizado correctamente.');
        this.cerrarModal();
      });
    } else {
      const nuevoHorario: Horario = {
        dia: this.modalHorario.dia,
        horaInicio: this.modalHorario.hora.split('-')[0],
        horaFin: this.modalHorario.hora.split('-')[1],
        materia: {
          idMateria: this.modalHorario.idMateria,
          nombreMateria: this.materias.find((m) => m.idMateria === this.modalHorario.idMateria)
            ?.nombreMateria || '',
        },
        docente: {
          idDocente: this.modalHorario.idDocente,
          nombreDocente: this.docentes.find((d) => d.idDocente === this.modalHorario.idDocente)
            ?.nombreDocente || '',
        },
        laboratorio: {
          idLaboratorio: this.modalHorario.idLaboratorio,
          nombreLaboratorio: this.laboratorios.find((l) => l.idLaboratorio === this.modalHorario.idLaboratorio)
            ?.nombreLaboratorio || '',
        },
      };

      this.horarioService.crearHorario(nuevoHorario).subscribe((horarioCreado) => {
        this.horarios.push(horarioCreado);
        console.log('Horario creado correctamente.');
        this.cerrarModal();
      });
    }
  }

  obtenerHorario(hora: string, dia: string): string {
    const horario = this.horarios.find(
      (h) => h.dia === dia && `${h.horaInicio}-${h.horaFin}` === hora
    );
    return horario
      ? `${horario.materia?.nombreMateria || ''} - ${horario.docente?.nombreDocente || ''} - ${horario.laboratorio?.nombreLaboratorio || ''}`
      : 'Disponible';
  }

  onCellClicked(event: any): void {
    const action = event.event.target.getAttribute('data-action');
    const horario = event.data;

    if (action === 'edit') {
      this.abrirModal(`${horario.horaInicio}-${horario.horaFin}`, horario.dia);
    } else if (action === 'delete') {
      this.horarios = this.horarios.filter(
        (h) => !(h.dia === horario.dia && h.horaInicio === horario.horaInicio)
      );
      console.log('Horario eliminado correctamente.');
    }
  }
}

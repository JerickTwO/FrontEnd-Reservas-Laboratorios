import { Component, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Reserva } from 'src/app/models/reserva.model';
import { DiaEnum, Laboratorio } from 'src/app/models/laboratorio.model';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Periodo } from 'src/app/models/periodo.model';
import localeEs from '@angular/common/locales/es';
import { HorarioService } from 'src/app/core/services/horario.service';
import { Horario } from 'src/app/models/horario.model';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    PaginationComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  styleUrls: ['./reserva.component.scss'],
  templateUrl: './reserva.component.html',
})
export class ReservaComponent implements OnInit {
  reservas: Reserva[] = [];
  laboratorios: Laboratorio[] = [];
  horario: Horario[] = [];
  nuevaReserva: Reserva = this.resetNuevaReservaData();
  modalVisible: boolean = false;
  isEditing: boolean = false;
  reservasPaginadas: Reserva[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  modalReserva: any;
  usuario!: Usuario;
  reservasPeriodoActivo: Reserva[] = [];
  userRole: string | undefined;
  franjasHorario: any;
  isLoading: boolean = false;
  minDate: string;
  maxDate: string;
  selectedLabForPDF: number | null = null;
  public franjasPermitidas: { horaInicio: string; horaFin: string }[] = [];

  dias: DiaEnum[] = [
    DiaEnum.LUNES,
    DiaEnum.MARTES,
    DiaEnum.MIERCOLES,
    DiaEnum.JUEVES,
    DiaEnum.VIERNES,
  ];
  eventos: any[] = [];
  clases: any[] = [];

  constructor(
    private reservaService: ReservaService,
    private laboratorioService: LaboratorioService,
    private paginationService: PaginationService,
    private usuarioService: UsuarioService,
    private horarioService: HorarioService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.getLaboratorios();
    this.getHorarios();
    this.getReservasConPeriodoActivo();
    this.modalReserva = new Modal(document.getElementById('modalReserva')!, {
      backdrop: 'static',
    });

    document
      .getElementById('modalReserva')
      ?.addEventListener('hidden.bs.modal', () => {
        this.cerrarModal();
      });
    this.usuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.userRole = usuario.rol.nombre;
      }
    });

    this.getReservas();
  }

  getReservas(): void {
    this.reservaService.listarReservas().subscribe({
      next: (data) => {
        data.forEach((reserva) => {
          if (
            reserva.fechaActualizacion &&
            typeof reserva.fechaActualizacion === 'string'
          ) {
            reserva.fechaActualizacion = new Date(reserva.fechaActualizacion);
          }
        });

        this.reservas = data;
        this.totalPages = Math.ceil(this.reservas.length / this.itemsPerPage);
        this.actualizarPaginacion();
      },
      error: (err) => console.error('Error al cargar las reservas:', err),
    });
  }

  getReservasConPeriodoActivo(): void {
    this.reservaService.obtenerReservasPeriodo().subscribe({
      next: (data) => {
        data.forEach((reserva) => {
          if (
            reserva.fechaActualizacion &&
            typeof reserva.fechaActualizacion === 'string'
          ) {
            reserva.fechaActualizacion = new Date(reserva.fechaActualizacion);
          }
        });

        this.reservasPeriodoActivo = data;
        this.totalPages = Math.ceil(this.reservas.length / this.itemsPerPage);
        this.actualizarPaginacion();
      },
      error: (err) => console.error('Error al cargar las reservas:', err),
    });
  }
  getLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
      },
      error: (err) => console.error('Error al cargar los laboratorios:', err),
    });
  }
  getHorarios(): void {
    this.horarioService.obtenerHorarios().subscribe({
      next: (data) => {
        this.horario = data.resultado;
        console.log('Horario:', this.horario);
        if (this.horario.length > 0) {
          const firstHorario = this.horario[0];
          console.log('Horario:', firstHorario);
          this.franjasPermitidas =
            firstHorario.franjasHorario?.map((franja: string) => {
              const [horaInicio, horaFin] = franja.split('-');
              return { horaInicio, horaFin };
            }) || [];
        }
      },
      error: (err) => console.error('Error al cargar los horarios:', err),
    });
  }

  guardarReserva(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    console.log('Fecha antes de procesar:', this.nuevaReserva.fechaReserva);

    // Asegurarnos de que la fecha es un objeto Date
    if (
      this.nuevaReserva.fechaReserva &&
      !(this.nuevaReserva.fechaReserva instanceof Date)
    ) {
      this.nuevaReserva.fechaReserva = new Date(this.nuevaReserva.fechaReserva);
    }

    if (this.nuevaReserva.fechaReserva) {
      const fecha = new Date(this.nuevaReserva.fechaReserva);
      fecha.setHours(0, 0, 0, 0);
      this.nuevaReserva.fechaReserva = fecha;
      console.log('Fecha después de procesar:', this.nuevaReserva.fechaReserva);
    }

    // Formatear las horas al formato que espera el backend (HH:mm:ss)
    const reservaToSave = {
      ...this.nuevaReserva,
      horaInicio: this.nuevaReserva.horaInicio.includes(':')
        ? this.nuevaReserva.horaInicio.length === 5
          ? this.nuevaReserva.horaInicio + ':00'
          : this.nuevaReserva.horaInicio
        : this.nuevaReserva.horaInicio + ':00:00',
      horaFin: this.nuevaReserva.horaFin.includes(':')
        ? this.nuevaReserva.horaFin.length === 5
          ? this.nuevaReserva.horaFin + ':00'
          : this.nuevaReserva.horaFin
        : this.nuevaReserva.horaFin + ':00:00',
    };

    console.log('Reserva a guardar:', reservaToSave);

    if (typeof this.nuevaReserva.laboratorio.idLaboratorio === 'string') {
      this.nuevaReserva.laboratorio.idLaboratorio = parseInt(
        this.nuevaReserva.laboratorio.idLaboratorio,
        10
      );
    }

    if (this.isEditing) {
      if (!this.nuevaReserva.idReserva) {
        console.error('ID inválido para actualizar la reserva.');
        this.isLoading = false;
        return;
      }
      this.reservaService
        .actualizarReserva(this.nuevaReserva.idReserva, reservaToSave)
        .subscribe({
          next: () => {
            Swal.fire(
              'Reserva Actualizada',
              'La reserva se actualizó correctamente.',
              'success'
            );
            this.getReservas();
            this.cerrarModal();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo actualizar la reserva.', 'error');
            console.error('Error al actualizar la reserva:', err);
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.reservaService.crearReserva(reservaToSave).subscribe({
        next: () => {
          Swal.fire(
            'Reserva Creada',
            'La reserva se creó correctamente.',
            'success'
          );
          this.getReservas();
          this.cerrarModal();
        },
        error: (err) => {
          const errorMessage =
            err.error?.detalleError || 'No se pudo crear la reserva.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
          console.error('Error al crear la reserva:', err);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  cambiarEstadoPendiente(reserva: Reserva): void {
    if (reserva.idReserva === undefined || reserva.idReserva === null) {
      console.error('ID de reserva no definido.');
      Swal.fire(
        'Error',
        'No se ha encontrado un ID de reserva válido.',
        'error'
      );
      return;
    }

    if (reserva.estado !== 'PENDIENTE') {
      console.error('La reserva no está en estado "PENDIENTE".');
      return;
    }

    Swal.fire({
      title: '¿Qué deseas hacer con esta reserva?',
      text: 'Puedes aprobar o rechazar esta reserva.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Rechazar',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        reserva.estado = 'APROBADA';
        this.reservaService
          .actualizarReserva(reserva.idReserva!, reserva)
          .subscribe({
            next: () => {
              Swal.fire(
                'Estado actualizado',
                'La reserva ha sido aprobada.',
                'success'
              );
              this.getReservas();
            },
            error: (err) => {
              Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
              console.error('Error al cambiar el estado de la reserva:', err);
            },
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        reserva.estado = 'RECHAZADA';
        this.reservaService
          .actualizarReserva(reserva.idReserva!, reserva)
          .subscribe({
            next: () => {
              Swal.fire(
                'Estado actualizado',
                'La reserva ha sido rechazada.',
                'error'
              );
              this.getReservas();
            },
            error: (err) => {
              Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
              console.error('Error al cambiar el estado de la reserva:', err);
            },
          });
      }
    });
  }

  abrirModal(): void {
    this.isEditing = false;
    const nuevaReserva = this.resetNuevaReservaData();
    nuevaReserva.fechaReserva = new Date();
    nuevaReserva.fechaReserva.setHours(0, 0, 0, 0);
    this.nuevaReserva = nuevaReserva;
    this.getReservas();
    this.modalReserva.show();
  }

  abrirModalEditar(reserva: Reserva): void {
    this.isEditing = true;
    console.log('Reserva original a editar:', reserva);

    let fechaReserva: Date;

    if (reserva.fechaReserva) {
      fechaReserva =
        reserva.fechaReserva instanceof Date
          ? new Date(reserva.fechaReserva)
          : new Date(reserva.fechaReserva);
    } else {
      fechaReserva = new Date();
    }
    const formatearHora = (hora: string) => {
      if (!hora) return '';
      return hora.substring(0, 5);
    };

    if (reserva.laboratorio && reserva.laboratorio.idLaboratorio) {
      if (
        this.horario &&
        Array.isArray(this.horario) &&
        this.horario.length > 0 &&
        this.horario[0].franjasHorario
      ) {
        this.franjasPermitidas = this.horario[0].franjasHorario.map(
          (franja: string) => {
            const [horaInicio, horaFin] = franja.split('-');
            return { horaInicio, horaFin };
          }
        );
      }
    }

    this.nuevaReserva = {
      ...reserva,
      fechaReserva: fechaReserva,
      horaInicio: formatearHora(reserva.horaInicio),
      horaFin: formatearHora(reserva.horaFin),
    };

    console.log('Reserva preparada para editar:', this.nuevaReserva);
    this.modalReserva.show();
  }

  cerrarModal(): void {
    this.modalReserva.hide();
    document.body.classList.remove('modal-open');
    this.isEditing = false;
    this.nuevaReserva = this.resetNuevaReservaData();
  }
  eliminarReserva(id: number | undefined): void {
    if (!id) {
      console.error('ID inválido para eliminar reserva.');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.eliminarReserva(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'La reserva ha sido eliminada.',
              'success'
            ).then(() => {
              this.getReservasConPeriodoActivo();
            });
          },
          error: (err) => {
            Swal.fire('Error', 'Hubo un error al eliminar la reserva', 'error');
            console.error('Error al eliminar la reserva:', err);
          },
        });
      }
    });
  }

  private resetNuevaReservaData(): Reserva {
    return {
      idReserva: 0,
      nombreCompleto: '',
      correo: '',
      fechaReserva: new Date() || new Date('YYYY-MM-DD'),
      telefono: '',
      ocupacionLaboral: '',
      laboratorio: {
        idLaboratorio: 0,
        nombreLaboratorio: '',
        ubicacion: '',
        capacidad: 0,
      },
      periodo: new Periodo(),
      horaInicio: '',
      horaFin: '',
      motivoReserva: '',
      cantidadParticipantes: 0,
      requerimientosTecnicos: '',
      estado: 'PENDIENTE',
    };
  }

  private formatTime(hour: string): string {
    if (hour && !hour.includes(':')) {
      return `${hour}:00`;
    }
    return hour;
  }

  actualizarPaginacion(): void {
    this.reservasPaginadas = this.paginationService.paginate(
      this.reservas,
      this.currentPage,
      this.itemsPerPage
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }
  exportarPDF(): void {
    const doc = new jsPDF();

    const itinLogo = 'assets/img/logos/itin.png';
    const espeLogo = 'assets/img/logos/espe.png';

    // Agregamos los logos
    doc.addImage(espeLogo, 'PNG', 15, 1, 70, 30);
    doc.addImage(itinLogo, 'PNG', 130, 8, 55, 20);

    // 1) Determinar el título según el laboratorio seleccionado
    let tituloPDF = 'REPORTE DE RESERVA DE LABORATORIOS - GENERAL';
    if (this.selectedLabForPDF) {
      // Busca el laboratorio por id
      const labSeleccionado = this.laboratorios.find(
        (lab) => lab.idLaboratorio === Number(this.selectedLabForPDF)
      );
      if (labSeleccionado) {
        tituloPDF = `REPORTE DE RESERVAS POR ${labSeleccionado.nombreLaboratorio}`;
      }
    }

    // Ajustar la fuente y escribir el título
    doc.setFontSize(14);
    doc.text(tituloPDF, 50, 40);

    // 2) Filtrar las reservas (si corresponde)
    let reservasFiltradas = this.reservas;
    if (this.selectedLabForPDF) {
      reservasFiltradas = this.reservas.filter((reserva) => {
        return (
          reserva.laboratorio.idLaboratorio === Number(this.selectedLabForPDF)
        );
      });
    }

    // 3) Preparar datos para autoTable
    const datosExportacion = reservasFiltradas.map((reserva) => [
      reserva.laboratorio.nombreLaboratorio,
      reserva.nombreCompleto,
      reserva.fechaReserva instanceof Date
        ? reserva.fechaReserva.toLocaleDateString()
        : reserva.fechaReserva,
      `${reserva.horaInicio} - ${reserva.horaFin}`,
      reserva.cantidadParticipantes,
      reserva.motivoReserva,
    ]);

    // 4) Generar la tabla
    autoTable(doc, {
      head: [
        [
          'LABORATORIO',
          'NOMBRE DEL SOLICITANTE',
          'FECHA',
          'HORA',
          'PARTICIPANTES',
          'MOTIVO',
        ],
      ],
      body: datosExportacion,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
    });

    // 5) Descargar el PDF
    doc.save('Reservas.pdf');
  }
}

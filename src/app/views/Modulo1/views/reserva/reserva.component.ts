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
    private usuarioService: UsuarioService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.getLaboratorios();
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
        // console.log('Rol del usuario:', this.userRole);
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
        console.log(
          'Franjas Laboratorio:',
          this.laboratorios[0].franjasHorario
        );

        // Conviertes cada string en un objeto con horaInicio/horaFin
        if (this.laboratorios.length > 0) {
          this.franjasPermitidas = this.laboratorios[0].franjasHorario.map(
            (franja: string) => {
              const [horaInicio, horaFin] = franja.split('-');
              return { horaInicio, horaFin };
            }
          );
        }
      },
      error: (err) => console.error('Error al cargar los laboratorios:', err),
    });
  }

  guardarReserva(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    // Asegurarse de que la fecha se envíe en el formato correcto
    if (this.nuevaReserva.fechaReserva) {
      // Convertir la fecha a UTC
      const fecha = new Date(this.nuevaReserva.fechaReserva);
      fecha.setHours(0, 0, 0, 0);
      this.nuevaReserva.fechaReserva = fecha;
    }

    // Convertir el ID del laboratorio a número si es string
    if (typeof this.nuevaReserva.laboratorio.idLaboratorio === 'string') {
      this.nuevaReserva.laboratorio.idLaboratorio = parseInt(this.nuevaReserva.laboratorio.idLaboratorio, 10);
    }

    if (this.isEditing) {
      if (!this.nuevaReserva.idReserva) {
        console.error('ID inválido para actualizar la reserva.');
        this.isLoading = false;
        return;
      }
      this.reservaService
        .actualizarReserva(this.nuevaReserva.idReserva, this.nuevaReserva)
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
            Swal.fire(
              'Error',
              'No se pudo actualizar la reserva.',
              'error'
            );
            console.error('Error al actualizar la reserva:', err);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } else {
      this.reservaService.crearReserva(this.nuevaReserva).subscribe({
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
          const errorMessage = err.error?.detalleError || 'No se pudo crear la reserva.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage
          });
          console.error('Error al crear la reserva:', err);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
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
    const fechaReserva = reserva.fechaReserva ? new Date(reserva.fechaReserva) : new Date();
    fechaReserva.setHours(0, 0, 0, 0);
    this.nuevaReserva = {
      ...reserva,
      fechaReserva: fechaReserva
    };
    this.nuevaReserva.horaInicio = reserva.horaInicio;
    this.nuevaReserva.horaFin = reserva.horaFin;
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

    this.reservaService.eliminarReserva(id).subscribe({
      next: () => {
        console.log(`Reserva con ID ${id} eliminada correctamente.`);
        this.getReservas();
      },
      error: (err) => console.error('Error al eliminar la reserva:', err),
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
        franjasHorario: [],
        diasHorario: [],
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

    // Agregar logos
    const itinLogo = 'assets/img/logos/itin.png';
    const espeLogo = 'assets/img/logos/espe.png';

    doc.addImage(espeLogo, 'PNG', 15, 1, 70, 30);
    doc.addImage(itinLogo, 'PNG', 130, 8, 55, 20);

    // Título
    doc.setFontSize(14);
    doc.text('REPORTE DE RESERVA DE LABORATORIOS', 50, 40);

    // Preparar datos de la tabla
    const datosExportacion = this.reservas.map((reserva) => [
      reserva.nombreCompleto,
      reserva.fechaActualizacion
        ? `${reserva.fechaActualizacion.getDate()}/${reserva.fechaActualizacion.getMonth() + 1
        }/${reserva.fechaActualizacion.getFullYear()}`
        : '',
      `${reserva.horaInicio}-${reserva.horaFin}`,

      reserva.motivoReserva,
    ]);

    autoTable(doc, {
      head: [['NOMBRE', 'FECHA', 'HORA', 'MOTIVO']],
      body: datosExportacion,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
    });

    // Descargar PDF
    doc.save('Reservas.pdf');
  }
}

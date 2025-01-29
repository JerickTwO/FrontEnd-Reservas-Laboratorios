import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { NotificationService } from '../../services/notification.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Notification } from 'src/app/interfaces/notification.interface';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, TooltipModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit, OnDestroy {
  // DATOS DE LA SESION
  role_user: number | null = null;

  @Input() routes: string[] = [];

  // Variables
  notifications: Notification[] = [];

  type: string = ''; // El tipo de notificacion
  title: string = 'Titulo de la notificación';
  message: string =
    'Este es el mensaje de la notificación que llega para probar la estructura';
  time: string = 'hace 3 horas';
  status!: boolean; // El estado leido / no leido
  delete!: boolean; // El estado eliminado / no eliminado

  // Si existe link en el mensaje
  // Las opciones eliminar / marcar como leido / otra accion

  private globalClickListener!: () => void;

  constructor(
    private renderer: Renderer2,
    private notificationService: NotificationService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // Cerrar menu de opciones
    this.renderer.listen('document', 'click', this.onClickOutside.bind(this));
    this.getAllNotificationsForAdmins();
  }

  ngOnDestroy(): void {
    if (this.globalClickListener) {
      this.globalClickListener();
    }
  }

  getAllNotificationsForAdmins() {
    this.notificationService
      .getAllNotificationsForAdmins(this.usuarioService.uid)
      .subscribe((data) => {
         this.notifications = data;
      });
  }

  parseDate(date: Date) {
    //"created_at": "2024-07-22T04:53:55.000Z"
    // time: string = 'hace 3 horas';
    const fecha = new Date(date);
    return fecha.toLocaleDateString();
  }
  // =============================================================================
  // Acciones de opciones
  // =============================================================================
  mark_read() {
    console.log('no leido');
  }

  // =============================================================================
  // Abrir menu de opciones de notificacion
  // =============================================================================
  showOptions: { [key: number]: boolean } = {};

  showMenuOptions(event: MouseEvent, id: number) {
    event.stopPropagation();

    // Restablece el estado de los menus
    this.resetMenuOptions();

    // Activa el menu
    this.showOptions[id] = true;
  }

  resetMenuOptions() {
    Object.keys(this.showOptions).forEach((key: any) => {
      this.showOptions[key] = false;
    });
  }

  onClickOutside(event: Event) {
    // Lógica para cerrar el menú de opciones si se hace clic fuera
    this.resetMenuOptions();
  }
}

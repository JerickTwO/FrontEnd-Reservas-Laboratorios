import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecoveryService } from 'src/app/core/services/recuperarContrasena.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enter-email',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './enter-email.component.html',
  styleUrls: ['../../actualizarContrasena/actualizarContrasena.component.scss'],
})
export class EnterEmailComponent {
  correo: string = '';
  title: string = 'Recuperar Contraseña';
  isSaving: boolean = false;

  constructor(
    private recoveryService: RecoveryService,
    private router: Router
  ) { }

  enviarCorreo() {
    this.recoveryService.enviarCorreoRecuperacion(this.correo).subscribe({
      next: (response) => {
        if (response.respuesta) {
          Swal.fire('Éxito', 'Código de recuperación enviado.', 'success');
          this.router.navigate(['/recovery/verify-code'], {
            queryParams: { correo: this.correo }
          });
        } else {
          Swal.fire('Error', response.mensaje || 'Correo no registrado.', 'error');
        }
      },
      error: (error) => {
        Swal.fire('Error', 'Error al enviar el correo. Inténtalo nuevamente.', 'error');
        console.error('Error al enviar correo:', error);
      }
    });
  }

}

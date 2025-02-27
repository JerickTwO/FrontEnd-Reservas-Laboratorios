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
  styleUrls: ['./enter-email.component.scss']
})
export class EnterEmailComponent {
  correo: string = '';

  constructor(
    private recoveryService: RecoveryService,
    private router: Router
  ) { }

  enviarCorreo() {
    this.recoveryService.enviarCorreoRecuperacion(this.correo).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Código de recuperación enviado.', 'success');
        this.router.navigate(['/recovery/verify-code'], {
          queryParams: { correo: this.correo }
        });
      },
      error: (error) => {
        Swal.fire('Error', 'Correo no registrado.', 'error');
        console.error('Error al enviar correo:', error);
      }
    });
  }
}

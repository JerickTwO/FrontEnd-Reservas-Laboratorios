import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecoveryService } from 'src/app/core/services/recuperarContrasena.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  correo: string = '';
  code: string = '';
  newPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recoveryService: RecoveryService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.correo = params['correo'];
      this.code = params['code'];
    });
  }

  resetPassword() {
    if (!this.newPassword.trim()) {
      Swal.fire('Error', 'La nueva contraseña no puede estar vacía.', 'error');
      return;
    }
    if (this.newPassword.length < 8) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres.', 'error');
      return;
    }

    this.recoveryService.resetPassword(this.correo, this.code, this.newPassword).subscribe({
      next: (response) => {
        if (response.respuesta) {
          Swal.fire('Éxito', 'Contraseña actualizada.', 'success');
          this.router.navigate(['/login']);
        } else {
          Swal.fire('Error', response.mensaje || 'No se pudo actualizar la contraseña.', 'error');
          console.error('Error en la respuesta del backend:', response);
        }
      },
      error: (error) => {
        Swal.fire('Error', 'Error en el servidor. Inténtalo nuevamente.', 'error');
        console.error('Error al actualizar contraseña:', error);
      }
    });
  }


}

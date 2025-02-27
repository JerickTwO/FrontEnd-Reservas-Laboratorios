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
    this.recoveryService.resetPassword(this.correo, this.code, this.newPassword).subscribe({
      next: (response) => {
        console.log('Correo a enviar:', this.correo); // Verificar que no sea null
        Swal.fire('Éxito', 'Contraseña actualizada.', 'success');
        this.router.navigate(['/login'])
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo actualizar la contraseña.', 'error');
        console.error('Error al actualizar contraseña:', error);
      }
    });
  }
}

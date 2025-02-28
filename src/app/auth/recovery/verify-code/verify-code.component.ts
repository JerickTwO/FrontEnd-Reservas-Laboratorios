import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecoveryService } from 'src/app/core/services/recuperarContrasena.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './verify-code.component.html',
  styleUrls: ['../../actualizarContrasena/actualizarContrasena.component.scss'],
})
export class VerifyCodeComponent implements OnInit {
  correo: string = '';
  code: string = '';
  isVerifying: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recoveryService: RecoveryService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.correo = params['correo'];
    });
  }

  verificarCodigo() {
    if (this.isVerifying) {
      return;
    }

    if (!this.code.trim()) {
      Swal.fire('Error', 'El código no puede estar vacío.', 'error');
      return;
    }

    if (this.code.length !== 6) {
      Swal.fire('Error', 'El código debe tener 6 dígitos.', 'error');
      return;
    }

    this.isVerifying = true;

    this.recoveryService.verificarCodigo(this.correo, this.code).subscribe({
      next: (response) => {
        if (response.respuesta) {
          Swal.fire('Éxito', 'Código verificado.', 'success');
          this.router.navigate(['/recovery/reset-password'], {
            queryParams: { correo: this.correo, code: this.code }
          });
        } else {
          Swal.fire('Error', response.mensaje || 'Código incorrecto o expirado.', 'error');
        }
        this.isVerifying = false;
      },
      error: (error) => {
        this.isVerifying = false;
        Swal.fire('Error', 'Error al verificar el código. Inténtalo nuevamente.', 'error');
        console.error('Error al verificar código:', error);
      }
    });
  }
}


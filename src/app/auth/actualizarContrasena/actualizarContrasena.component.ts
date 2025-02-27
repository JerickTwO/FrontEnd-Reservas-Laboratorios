import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-contrasena',
  standalone: true,
  templateUrl: './actualizarContrasena.component.html',
  styleUrls: ['./actualizarContrasena.component.scss'],
  imports: [
    ReactiveFormsModule
  ],
})
export class ActualizarContrasenaComponent implements OnInit {
  title: string = 'Actualizar Contraseña';
  loading = false;
  actualizarContrasenaForm: FormGroup;
  mostrarPassword = {
    current: false,
    new: false,
    confirm: false
  };

  togglePassword(campo: 'current' | 'new' | 'confirm') {
    this.mostrarPassword[campo] = !this.mostrarPassword[campo];
  }
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.actualizarContrasenaForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  actualizarContrasena() {
    if (this.actualizarContrasenaForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente', 'error');
      return;
    }
    if (this.actualizarContrasenaForm.value.newPassword !== this.actualizarContrasenaForm.value.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    this.loading = true;

    this.usuarioService.updatePassword(this.actualizarContrasenaForm.value).subscribe(
      (resp) => {
        this.loading = false;
        if (resp && resp.respuesta) {
          Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
          this.router.navigateByUrl('/login');
        } else {
          Swal.fire('Error', resp?.mensaje || 'Error al actualizar la contraseña', 'error');
        }
      },
      (error) => {
        this.loading = false;
        Swal.fire('Error', error?.mensaje || 'Error en el servidor. Inténtalo nuevamente.', 'error');
        console.error('Error al actualizar la contraseña:', error);
      }
    );
  }

  // Métodos de ayuda para mostrar errores en el formulario
  campoEsValido(campo: string): boolean {
    return !!this.actualizarContrasenaForm.controls[campo]?.errors
      && this.actualizarContrasenaForm.controls[campo].touched;
  }


  get currentPasswordNoValido(): boolean {
    return this.campoEsValido('currentPassword');
  }

  get newPasswordNoValido(): boolean {
    return this.campoEsValido('newPassword');
  }

  get confirmPasswordNoValido(): boolean {
    return this.campoEsValido('confirmPassword');
  }
}
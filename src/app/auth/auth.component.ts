import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';

import { AlertService } from '../core/services/alerts.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '../core/services/usuario.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class AuthComponent implements OnInit {
  title: string = 'Administración';
  loading: boolean = false; // Para deshabilitar el botón de "Ingresar" durante la solicitud HTTP
  errorMenssage: string = ''; // Para mostrar mensajes de error

  // Formulario
  loginForm: FormGroup;
  usernameControl: AbstractControl | null = null;
  password_userControl: AbstractControl | null = null;

  constructor(
    private alertsService: AlertService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password_user: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMenssage = ''; // Vaciar el mensaje de error cuando se detecte un cambio en el formulario
    });

    // Control de formulario
    this.usernameControl = this.loginForm.get('username');
    this.password_userControl = this.loginForm.get('password_user');
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMenssage = 'Por favor, llene todos los campos.';
      return;
    }
    this.loading = true;
    const { username, password_user } = this.loginForm.value;
    console.log(username, password_user);

    this.usuarioService.login({ username, password: password_user }).subscribe(
      (resp) => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        this.loading = false;

        if (err.error && err.error.message) {
          this.errorMenssage = err.error.message;
        } else {
          this.errorMenssage = "Error desconocido. Inténtalo nuevamente.";
        }

        console.error("Error en login:", err);
      }
    );

  }
}

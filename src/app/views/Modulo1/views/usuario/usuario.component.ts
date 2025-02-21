import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Departamento } from 'src/app/models/departamento.model';
import { DocenteService } from 'src/app/core/services/docente.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { AdministradorService } from 'src/app/core/services/administrador.service';
import { Administrador } from 'src/app/models/administrador.model';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario, Roles } from 'src/app/models/usuario.model';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarioAEditar: Usuario | null = null;

  docentes: Usuario[] = [];
  departamentos: Departamento[] = [];
  newDocente: Docente = new Docente();
  selectedDocente: Docente | null = null;
  isEditing: boolean = false;
  administradores: Usuario[] = [];
  newAdministrador: Administrador = new Administrador();
  selectedAdminstrador: Administrador | null = null;
  administradoresPaginados: Administrador[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  usuariosUnificados: any[] = [];
  usuarios: Usuario[] = [];
  selectedUsuario: Usuario | null = null;
  nuevoUsuario: Usuario = {
    id: 0,
    idUser: 0,
    usuario: '',
    nombre: '',
    apellido: '',
    nombreCompleto: '',
    correo: '',
    idInstitucional: '',
    departamentoId: 0,
    tipoUsuario: '' as 'DOCENTE' | 'ADMINISTRADOR',
    contrasena: '',
    rol: 'DOCENTE' as unknown as Roles,
    primerLogin: false,
    estado: true
  };
  constructor(
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService,
    private administradorService: AdministradorService,
    private usuarioService: UsuarioService,
  ) { }
  ngOnInit(): void {
    this.cargarListaUnificada();
    this.cargarDepartamentos();
  }
  cargarDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe(
      (data) => {
        this.departamentos = data
        console.log('Departamentos cargados:', data);

      },
      (error) => console.error('Error al cargar departamentos:', error)
    );
  }
  openAddUsuarioModal(tipo: 'DOCENTE' | 'ADMINISTRADOR'): void {
    this.nuevoUsuario = {
      id: 0,
      idUser: 0,
      usuario: '',
      nombre: '',
      apellido: '',
      nombreCompleto: '',
      correo: '',
      idInstitucional: '',
      departamentoId: 0,
      tipoUsuario: tipo,
      contrasena: '',
      rol: 'DOCENTE' as unknown as Roles,
      primerLogin: false,
      estado: true
    };

    this.abrirModalCreacion();
  }

  cargarListaUnificada(): void {
    this.usuarioService.getUsuariosUnificados().subscribe({
      next: (usuarios) => {
        this.usuariosUnificados = usuarios;
        this.docentes = usuarios.filter(u => u.tipoUsuario === 'DOCENTE');
        this.administradores = usuarios.filter(u => u.tipoUsuario === 'ADMINISTRADOR');
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }
  openEditUsuarioModal(usuario: Usuario): void {
    // Clonamos
    this.usuarioAEditar = { ...usuario };

    // Si el backend te trae un objeto "departamento"
    // y no solo el ID, asignamos el ID a "departamentoId"
    if (this.usuarioAEditar.departamentoId) {
      this.usuarioAEditar.departamentoId = this.usuarioAEditar.departamentoId;
    }

    this.abrirModalEdicion();
  }

  guardarNuevo(): void {
    if (this.nuevoUsuario.tipoUsuario === 'ADMINISTRADOR') {
      this.crearAdministrador();
    } else {
      this.crearDocente();
    }
  }

  crearAdministrador(): void {
    const partes = this.nuevoUsuario.nombreCompleto.split(' ');
    const nombre = partes[0];
    const apellido = partes.slice(1).join(' ');

    const payloadAdmin: Administrador = {
      idAdministrador: 0,
      nombreAdministrador: nombre,
      apellidoAdministrador: apellido,
      correoAdministrador: this.nuevoUsuario.correo,
      idInstitucional: this.nuevoUsuario.idInstitucional
    };

    this.administradorService.agregarAdministrador(payloadAdmin).subscribe({
      next: (res) => {
        console.log('Administrador creado', res);
        this.actualizarListaLocal();
      },
      error: (err) => console.error('Error creando admin', err)
    });
  }
  getDepartmentName(id: number | undefined): string {
    if (!id) return '---';
    const dpto = this.departamentos.find(dep => dep.idDepartamento === id);
    return dpto ? dpto.nombreDepartamento : '---';
  }


  crearDocente(): void {
    const partes = this.nuevoUsuario.nombreCompleto.split(' ');
    const nombre = partes[0];
    const apellido = partes.slice(1).join(' ');

    const payloadDocente: Docente = {
      idDocente: 0,
      nombreDocente: nombre,
      apellidoDocente: apellido,
      correoDocente: this.nuevoUsuario.correo,
      idInstitucional: this.nuevoUsuario.idInstitucional,
      departamento: {
        idDepartamento: this.nuevoUsuario.departamentoId ?? 0,
        nombreDepartamento: '',
        descripcion: ''
      }
    };

    this.docenteService.agregarDocente(payloadDocente).subscribe({
      next: (res) => {
        console.log('Docente creado', res);
        this.actualizarListaLocal();
      },
      error: (err) => console.error('Error creando docente', err)
    });
  }

  actualizarUsuario(): void {
    if (!this.usuarioAEditar) return;

    if (this.usuarioAEditar.tipoUsuario === 'DOCENTE') {
      const partes = this.usuarioAEditar.nombreCompleto.split(' ');
      const nombre = partes[0];
      const apellido = partes.slice(1).join(' ');

      const payloadDocente: Docente = {
        idDocente: this.usuarioAEditar.id,
        nombreDocente: nombre,
        apellidoDocente: apellido,
        correoDocente: this.usuarioAEditar.correo,
        idInstitucional: this.usuarioAEditar.idInstitucional,
        departamento: {
          idDepartamento: this.usuarioAEditar.departamentoId ?? 0,
          nombreDepartamento: '',
          descripcion: ''
        }
      };

      this.docenteService.editarDocente(payloadDocente).subscribe({
        next: () => {
          console.log('Docente actualizado correctamente');
          this.cerrarModalEdicion();
          this.cargarListaUnificada();
        },
        error: (error: any) => {
          console.error('Error actualizando docente:', error);
        }
      });
    } else {
      // ...
    }
  }


  abrirModalEdicion(): void {

    const modalEl = document.getElementById('editUsuarioModal');
    if (modalEl) {
      const modalBootstrap = new bootstrap.Modal(modalEl);
      modalBootstrap.show(); // Removed as it is not defined
    }
  }
  abrirModalCreacion(): void {
    const modalEl = document.getElementById('addUsuarioModal');
    if (modalEl) {
      const modalBootstrap = new bootstrap.Modal(modalEl);
      modalBootstrap.show();
    }
  }

  cerrarModalEdicion(): void {
    const modalEl = document.getElementById('editUsuarioModal');
    if (modalEl) {
      const modalBootstrap = bootstrap.Modal.getInstance(modalEl);
      modalBootstrap?.hide();
    }
  }
  cerrarModalCreacion(): void {
    const modalEl = document.getElementById('addUsuarioModal');
    if (modalEl) {
      const modalBootstrap = bootstrap.Modal.getInstance(modalEl);
      modalBootstrap?.hide();
    }
  }


  actualizarListaLocal(): void {
    // 1. Cerrar el modal
    const modalEl = document.getElementById('addUsuarioModal');
    if (modalEl) {
      const modalBootstrap = bootstrap.Modal.getInstance(modalEl);
      modalBootstrap?.hide();
    }
    // 2. Recargar la lista unificada para reflejar el nuevo registro
    this.cargarListaUnificada();
  }
}
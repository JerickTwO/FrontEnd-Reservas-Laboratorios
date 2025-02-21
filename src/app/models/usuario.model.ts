import { Departamento } from "./departamento.model";

export interface Usuario {
  id: number;
  idUser: number;
  nombreCompleto: string;
  usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol: Roles;
  departamentoId?: number; // Guardaremos aquí el ID
  departamento?: string;
  primerLogin: boolean;
  estado: boolean;
  idInstitucional: string;
  tipoUsuario: 'DOCENTE' | 'ADMINISTRADOR'; 
}
export interface Roles {
  id: number;
  nombre: string;
  descripcion: string;
}

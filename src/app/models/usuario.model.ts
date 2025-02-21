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
  departamento?: Departamento | null;
  primerLogin: boolean;
  estado: boolean;
  idInstitucional: string;
  tipoUsuario: 'ADMINISTRADOR' | 'DOCENTE'; 
}
export interface Roles {
  id: number;
  nombre: string;
  descripcion: string;
}

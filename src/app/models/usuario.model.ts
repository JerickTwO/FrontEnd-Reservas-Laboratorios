export interface Usuario {
  id: number;
  idUser: number;
  usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol: Roles; // Aquí asumo que tienes un modelo 'Roles' similar a 'Usuario'
  primerLogin: boolean;
  estado: boolean;
}

export interface Roles {
  id: number;
  nombre: string;
  descripcion: string;
}

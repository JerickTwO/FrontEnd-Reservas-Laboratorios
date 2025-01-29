import { environment } from '../../environments/environment';

export class Usuario {
  constructor(
    public id: number,
    public user_login: string,
    public user_nicename: string,
    public user_email: string,
    public user_url: string,
    public display_name: string,
    public role?: 'Administrador' | 'Colaborador' | 'Customer'
  ) {}

  get imagenUrl() {
    if (!this.user_url) {
      return `${environment.urlBase}/upload/usuarios/no-image`;
    } else if (this.user_url.includes('https')) {
      return this.user_url;
    } else if (this.user_url) {
      return `${environment.urlBase}/upload/usuarios/${this.user_url}`;
    } else {
      return `${environment.urlBase}/upload/usuarios/no-image`;
    }
  }
}

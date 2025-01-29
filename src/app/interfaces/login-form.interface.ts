

export interface LoginForm {
  correo: string;
  password: string;
}


export interface UserReponse {
  ok:    boolean;
  msg:   string;
  data:  Data;
  token: string;
}

export interface Data {
  id:            number;
  user_login:    string;
  user_nicename: string;
  user_email:    string;
  user_url:      string;
  display_name:  string;
  role:          'Administrador' | 'Colaborador' | 'Customer';
}

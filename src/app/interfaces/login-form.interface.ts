

export interface LoginForm {
  username: string;
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
  username:    string;
  user_url:      string;
  display_name:  string;
  role:          'Administrador' | 'Colaborador' | 'Customer';
}

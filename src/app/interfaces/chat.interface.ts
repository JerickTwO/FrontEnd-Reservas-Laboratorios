export interface NewMessage {
  group_id: number | null;
  image_url: string;
  message_text: string;
  name: string;
  role_user: 'Administrador' | 'Colaborador' | 'Customer' | undefined;
  sender_id: number;
  created_at: string;
  sender?: 'me' | 'others';
  type_chat?: string | undefined;
}


export interface ChatMessageReponse {
  ok:   boolean;
  msg:  string;
  data: NewMessage[];
}

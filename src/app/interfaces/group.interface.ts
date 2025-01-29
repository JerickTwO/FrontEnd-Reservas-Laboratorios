export interface GroupEmpSupportResponde {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  group: Group[];
}

export interface Group {
  id:         number;
  user_id:    number;
  group_id:   number;
  name:       string;
  start_chat: number;
  type_chat?: string;
  unread_messages : number;
}


export interface GoupOrderResponde {
  ok:   boolean;
  msg:  string;
  data: GoupOrderData;
}

export interface GoupOrderData {
  groups: GoupOrderGroup[];
}

export interface GoupOrderGroup {
  id:          number;
  name:        string;
  order_id:    number;
  description: null;
  created_at:  string;
  updated_at:  string;
  status:      number;
  type_chat:   string;
  start_chat:  number;
  reason_chat: null;
}

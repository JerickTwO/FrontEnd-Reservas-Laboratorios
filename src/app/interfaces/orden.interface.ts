export interface OrderReponse {
  ok:   boolean;
  msg:  string;
  data: Orders;
}

export interface Orders {
  orders: Order[];
}

export interface Order {
  order_item_id:   number;
  order_item_name: string;
  status:          string;
  type:            string;
  total_amount:    string;
  orderAccepted:   number;
}


export interface OrderUserReponse {
  ok:   boolean;
  msg:  string;
  data: OrderUserData;
}

export interface OrderUserData {
  orders: OrderUser[];
}

export interface OrderUser {
  order_item_id:   number;
  order_item_name: string;
  status:          string;
  type:            string;
  total_amount:    string;
  user_id:         number;
  customer_id:     number;
  start_chat:      number;
  customer_name:   string;
  finish_chat:     number;
  unread_messages: number;
  name? : string;
  date_start_chat?: string;
  date_finish_chat?: string;
  duration?: string;
  is_order_approved?: number;
  rating? : number;
}

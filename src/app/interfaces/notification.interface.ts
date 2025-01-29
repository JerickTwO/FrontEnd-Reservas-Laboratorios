export interface NotificationResponde {
  ok:   boolean;
  msg:  string;
  data: Notification[];
}

export interface Notification {
  id:          number;
  group_id:    number;
  order_id:    null;
  description: null;
  name:        string;
  message:     null;
  type:        null;
  status:      number;
  created_at:  Date;
}

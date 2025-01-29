export interface FinanceResponde {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  finance: Finance[];
}

export interface Finance {
  id:         number;
  admin_id:   number;
  user_id:    number;
  order_id:   number;
  status:     number;
  quantity:   string;
  created_at: string;
}

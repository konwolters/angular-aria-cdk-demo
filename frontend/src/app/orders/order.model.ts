export interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  orderedAt: string;
  status: string;
  paymentMethod: string;
  total: number;
}

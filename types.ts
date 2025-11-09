
export enum OrderType {
  PICKUP = 'Pickup',
  DINE_IN = 'Dine-In',
  DELIVERY = 'Home Delivery',
}

export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface Product {
  name: string;
  price: number;
}

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  contactNumber: string;
  address?: string;
  orderType: OrderType;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  assignedTime?: string;
}
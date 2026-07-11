export interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
  avatar: string | null;
  createdAt: Date;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  category: string;
  isActive: boolean;
  sortOrder: number;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  nominal: string;
  bonus: string | null;
  isActive: boolean;
  sortOrder: number;
  gameId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  userId: string;
  gameAccountId: string;
  gameServerId: string | null;
  playerName: string | null;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product?: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  fee: number;
  total: number;
  paymentUrl: string | null;
  expiredAt: Date | null;
  paidAt: Date | null;
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED" | "EXPIRED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

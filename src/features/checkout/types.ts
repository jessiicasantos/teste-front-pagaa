export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt?: string;
}

export interface Coupon {
  code: string;
  discount: number;
}

export interface Cart {
  products: Product[];
  subtotal?: number;
  shipping?: number;
  taxes?: number;
  coupon?: Coupon;
  total: number;
}

export interface Billing {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  city: string;
  zipCode: string;
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface Order {
  id?: string;
  cart: Cart;
  billing: Billing;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}
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
  subtotal: number;
  shipping: number;
  taxes?: number;
  discount?: number;
  coupon?: Coupon;
  total: number;
}

export interface Order {
  id?: string;
  billing: {
    fullName: string;
    email: string;
    cpf: string;
    phone: string;
    zipCode: string;
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
  };
  cart: Cart[];
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}
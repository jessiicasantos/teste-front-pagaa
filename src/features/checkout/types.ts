export interface Product {
  id: string;
  amount: number;
  title: string;
  image: string;
  price: number;
}

export interface Cart {
  products: Product[];
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
  products: Product[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  note?: string;
};

export type CreateOrderItem = {
  productId: string;
  quantity: number;
  note?: string | null;
};

export type CreateOrderRequest = {
  items: CreateOrderItem[];
  note?: string | null;
};
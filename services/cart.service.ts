import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product) {
  const cart = getCart();

  const existing = cart.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl : product.imageUrl!,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function updateQuantity(productId: string, quantity: number) {
  const cart = getCart();

  const updated = cart.map((item) =>
    item.productId === productId
      ? { ...item, quantity }
      : item
  );

  saveCart(updated);
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
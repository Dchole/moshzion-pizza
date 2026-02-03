"use server";

import { cookies } from "next/headers";
import type { CartItem } from "@/types";

const CART_COOKIE_NAME = "cart";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface CartData {
  items: CartItem[];
}

async function getCartData(): Promise<CartData> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartCookie) {
    return { items: [] };
  }

  try {
    return JSON.parse(cartCookie.value);
  } catch {
    return { items: [] };
  }
}

async function setCartData(data: CartData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(data), {
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function getCart(): Promise<CartData> {
  return getCartData();
}

export async function addToCart(item: Omit<CartItem, "id">): Promise<CartData> {
  const cart = await getCartData();

  // Check if item with same pizza, size, and toppings exists
  const existingIndex = cart.items.findIndex(
    i =>
      i.pizzaId === item.pizzaId &&
      i.size === item.size &&
      JSON.stringify(i.toppings.sort()) === JSON.stringify(item.toppings.sort())
  );

  if (existingIndex >= 0) {
    // Update quantity of existing item
    cart.items[existingIndex].quantity += item.quantity;
  } else {
    // Add new item with unique ID
    cart.items.push({ ...item, id: `${Date.now()}-${Math.random()}` });
  }

  await setCartData(cart);
  return cart;
}

export async function removeFromCart(itemId: string): Promise<CartData> {
  const cart = await getCartData();
  cart.items = cart.items.filter(item => item.id !== itemId);
  await setCartData(cart);
  return cart;
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<CartData> {
  const cart = await getCartData();

  if (quantity <= 0) {
    cart.items = cart.items.filter(item => item.id !== itemId);
  } else {
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
    }
  }

  await setCartData(cart);
  return cart;
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

export async function getCartSummary() {
  const cart = await getCartData();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return { totalItems, totalPrice };
}

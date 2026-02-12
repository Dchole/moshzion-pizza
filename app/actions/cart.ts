"use server";

import { cookies } from "next/headers";
import type { CartItem } from "@/types";
import { z } from "zod";
import { COOKIES, CART } from "@/lib/config";
import { logger } from "@/lib/logger";

const CART_COOKIE_NAME = COOKIES.cart;
const MAX_AGE = COOKIES.cartMaxAge;

// Zod schema for cart item validation
const cartItemSchema = z.object({
  id: z.string(),
  pizzaId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  size: z.enum(["Small", "Medium", "Large", "Mega"]),
  toppings: z.array(z.string()),
  quantity: z
    .number()
    .int()
    .min(CART.minQuantityPerItem)
    .max(CART.maxQuantityPerItem),
  image: z.string()
});

const cartDataSchema = z.object({
  items: z.array(cartItemSchema).max(CART.maxItems)
});

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
    const parsed = JSON.parse(cartCookie.value);
    const validated = cartDataSchema.parse(parsed);
    return validated;
  } catch (error) {
    // If validation fails, return empty cart and clear invalid cookie
    logger.warn("Invalid cart data detected, clearing cart", { error });
    const cookieStore = await cookies();
    cookieStore.delete(CART_COOKIE_NAME);
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

  // Check cart limits
  if (cart.items.length >= CART.maxItems) {
    throw new Error(`Cart cannot exceed ${CART.maxItems} items`);
  }

  const existingIndex = cart.items.findIndex(
    i =>
      i.pizzaId === item.pizzaId &&
      i.size === item.size &&
      JSON.stringify([...i.toppings].sort()) ===
        JSON.stringify([...item.toppings].sort())
  );

  if (existingIndex >= 0) {
    const newQuantity = cart.items[existingIndex].quantity + item.quantity;
    // Enforce max quantity per item
    cart.items[existingIndex].quantity = Math.min(
      newQuantity,
      CART.maxQuantityPerItem
    );
  } else {
    // Validate and add new item
    const validatedItem = cartItemSchema.parse({
      ...item,
      id: crypto.randomUUID()
    });
    cart.items.push(validatedItem);
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
      // Enforce quantity limits
      item.quantity = Math.min(
        Math.max(quantity, CART.minQuantityPerItem),
        CART.maxQuantityPerItem
      );
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

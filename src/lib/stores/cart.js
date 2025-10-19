// src/lib/stores/cart.js
import { writable } from 'svelte/store';

// Recuperar carrito guardado
const initialCart = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('cart') || '[]')
  : [];

// Store principal
export const cart = writable(initialCart);

// Bandera para saber si ya se cargó desde localStorage
export const cartInitialized = writable(false);

// Sincronizar con localStorage
cart.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(value));
    cartInitialized.set(true); // Marcar como inicializado
  }
});

// Funciones auxiliares
export function addToCart(repuesto) {
  cart.update(items => [...items, repuesto]);
}

export function clearCart() {
  cart.set([]);
}
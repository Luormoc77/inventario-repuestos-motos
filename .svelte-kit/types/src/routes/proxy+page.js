// @ts-nocheck
// src/routes/+page.js
import PocketBase from 'pocketbase';

export const ssr = false;
export const prerender = false;

/** */
export async function load() {
  const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';
  const pb = new PocketBase(PB_URL);

  try {
    const response = await pb.collection('repuestos').getList(1, 5000);
    const repuestos = response.items;

    // Calcular estadísticas
    const total = repuestos.length;
    const disponibles = repuestos.filter(r => r.disponible).length;
    const categorias = [...new Set(repuestos.map(r => r.categoria))];
    const marcas = [...new Set(repuestos.map(r => r.marca))];

    return {
      repuestos,
      stats: {
        total,
        disponibles,
        categorias: categorias.length,
        marcas: marcas.length
      }
    };
  } catch (err) {
    console.error('Error al cargar repuestos:', err);
    return {
      repuestos: [],
      stats: { total: 0, disponibles: 0, categorias: 0, marcas: 0 },
      error: 'No se pudieron cargar los repuestos.'
    };
  }
}
<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { cart } from '$lib/stores/cart.js';
  import AddToQuoteButton from '$lib/components/AddToQuoteButton.svelte';

  // Recibimos los datos desde +page.js
  export let data;

  // Estado local para filtros
  let filtroNombre = '';
  let filtroPrecioMin = 0;
  let filtroPrecioMax = 1000;
  let filtroDisponible = true;

  // Filtro en el cliente (sobre los datos ya cargados)
  $: repuestosFiltrados = data.repuestos?.filter(item => {
    // Filtro por nombre
    const busqueda = filtroNombre.trim().toLowerCase();
    const coincideNombre = !busqueda || 
      item.nombre.toLowerCase().includes(busqueda) ||
      item.marca.toLowerCase().includes(busqueda) ||
      item.modelo_moto.toLowerCase().includes(busqueda);

    // Filtro por precio
    const enRangoPrecio = item.precio >= filtroPrecioMin && item.precio <= filtroPrecioMax;

    // Filtro por disponibilidad
    const disponible = !filtroDisponible || item.disponible;

    return coincideNombre && enRangoPrecio && disponible;
  }) || [];

  // Si hay error, lo mostramos
  $: error = data.error;
</script>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  .filters {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  .filter-group {
    display: flex;
    flex-direction: column;
  }
  label {
    font-weight: bold;
    margin-bottom: 6px;
    font-size: 0.9em;
    color: #495057;
  }
  input, select {
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1em;
  }
  .results {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  .card {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .card h3 {
    margin: 0 0 8px;
    font-size: 1.1em;
    color: #212529;
  }
  .card p {
    margin: 4px 0;
    font-size: 0.95em;
    color: #495057;
  }
  .price {
    font-weight: bold;
    color: #28a745;
    font-size: 1.2em;
    margin: 8px 0;
  }
  .stock {
    font-size: 0.9em;
    color: #6c757d;
  }
  .available {
    color: #28a745;
    font-weight: bold;
  }
  .unavailable {
    color: #dc3545;
    font-weight: bold;
  }
  .loading, .error {
    text-align: center;
    padding: 40px;
    font-size: 1.1em;
  }
  .error {
    color: #dc3545;
  }
  nav {
    text-align: right;
    margin-bottom: 20px;
  }
  nav a {
    color: #0d6efd;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1em;
  }
</style>

<div class="container">
  <nav>
    <a href="/cotizacion">📄 Ver cotización ({ $cart.length })</a>
  </nav>

  <h1>🔧 Inventario de Repuestos para Motos</h1>

<!-- Dentro del <div class="container">, después del <h1> -->
{#if data.stats}
  <div class="stats-banner">
    📊 <strong>{data.stats.total.toLocaleString()}</strong> repuestos •
    <strong>{data.stats.disponibles.toLocaleString()}</strong> disponibles •
    <strong>{data.stats.categorias}</strong> categorías •
    <strong>{data.stats.marcas}</strong> marcas
  </div>
{/if}

<style>
  /* ... tus estilos existentes ... */

  .stats-banner {
    background: #e9f7ef;
    border-left: 4px solid #28a745;
    padding: 12px 16px;
    margin: 16px 0 24px;
    border-radius: 0 4px 4px 0;
    font-size: 0.95em;
    color: #155724;
  }
</style>

  <!-- Filtros -->
  <div class="filters">
    <div class="filter-group">
      <label for="nombre">Buscar por nombre</label>
      <input
        id="nombre"
        type="text"
        placeholder="Ej: filtro de aceite"
        bind:value={filtroNombre}
      />
    </div>

    <div class="filter-group">
      <label for="precio-min">Precio mínimo ($)</label>
      <input
        id="precio-min"
        type="number"
        min="0"
        bind:value={filtroPrecioMin}
      />
    </div>

    <div class="filter-group">
      <label for="precio-max">Precio máximo ($)</label>
      <input
        id="precio-max"
        type="number"
        min="0"
        bind:value={filtroPrecioMax}
      />
    </div>

    <div class="filter-group">
      <label for="disponible">Disponibilidad</label>
      <select bind:value={filtroDisponible}>
        <option value="true">Solo disponibles</option>
        <option value="false">Todos (incl. agotados)</option>
      </select>
    </div>
  </div>

  <!-- Mensajes de estado -->
  {#if !data.repuestos}
    <div class="loading">Cargando...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if repuestosFiltrados.length === 0}
    <div class="loading">No se encontraron repuestos con esos filtros.</div>
  {:else}
    <!-- Resultados -->
    <div class="results">
      {#each repuestosFiltrados as repuesto}
        <div class="card">
          <img
            src={repuesto.imagen_url || 'https://via.placeholder.com/150?text=Sin+imagen'}
            alt={repuesto.nombre}
            style="width:100%; height:120px; object-fit:contain; margin-bottom:12px;"
          />
          <h3>{repuesto.nombre}</h3>
          <p><strong>Marca:</strong> {repuesto.marca}</p>
          <p><strong>Modelo:</strong> {repuesto.modelo_moto}</p>
          <p><strong>Categoría:</strong> {repuesto.categoria}</p>
          <div class="price">${repuesto.precio.toFixed(2)}</div>
          <div class="stock">
            Stock: {repuesto.stock} unidad{repuesto.stock !== 1 ? 'es' : ''}
          </div>
          <div class="{repuesto.disponible ? 'available' : 'unavailable'}">
            {repuesto.disponible ? '✅ Disponible' : '❌ Agotado'}
          </div>
          <!-- Botón de cotización -->
          <AddToQuoteButton {repuesto} />
        </div>
      {/each}
    </div>
  {/if}

  <p style="margin-top: 24px; color: #6c757d; font-size: 0.9em;">
    Mostrando {repuestosFiltrados.length} de {data.repuestos?.length || 0} repuestos.
  </p>
</div>
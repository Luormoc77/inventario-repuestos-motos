<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import PocketBase from 'pocketbase';

  // Configuración de PocketBase
  const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';
  const pb = new PocketBase(PB_URL);

  // Estado
  let repuestos = [];
  let loading = true;
  let error = null;

  // Filtros (reactivos)
  let filtroNombre = '';
  let filtroPrecioMin = 0;
  let filtroPrecioMax = 1000;
  let filtroDisponible = true;

  // Función para cargar repuestos desde PocketBase
  async function cargarRepuestos() {
    loading = true;
    error = null;

    try {
      // Construir la cadena de filtro
      let filterParts = [];

      if (filtroNombre.trim() !== '') {
        filterParts.push(`nombre ~ "${filtroNombre.trim()}"`);
      }

      filterParts.push(`precio >= ${filtroPrecioMin}`);
      filterParts.push(`precio <= ${filtroPrecioMax}`);
      filterParts.push(`disponible = ${filtroDisponible}`);

      const filterQuery = filterParts.join(' && ');

      // Consultar a PocketBase
      const response = await pb.collection('repuestos').getList(1, 50, {
        filter: filterQuery,
        sort: 'nombre',
        expand: '' // no necesitamos relaciones
      });

      repuestos = response.items;
    } catch (err) {
      console.error('Error al cargar repuestos:', err);
      error = 'No se pudieron cargar los repuestos. ¿Está PocketBase ejecutándose?';
    } finally {
      loading = false;
    }
  }

  // Cargar datos al montar el componente
  onMount(() => {
    cargarRepuestos();
  });

  // Reactividad: recargar cuando cambien los filtros
  $: cargarRepuestos();
</script>

<!-- Estilos básicos (puedes mejorarlos después con Tailwind o CSS) -->
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
</style>

<div class="container">
  <h1>🔧 Inventario de Repuestos para Motos</h1>

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
  {#if loading}
    <div class="loading">Cargando repuestos...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if repuestos.length === 0}
    <div class="loading">No se encontraron repuestos con esos filtros.</div>
  {:else}
    <!-- Resultados -->
    <div class="results">
      {#each repuestos as repuesto}
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
        </div>
      {/each}
    </div>
  {/if}

  <p style="margin-top: 24px; color: #6c757d; font-size: 0.9em;">
    Mostrando {repuestos.length} de 2000+ repuestos.
  </p>
</div>
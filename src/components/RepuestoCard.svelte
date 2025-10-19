<!-- src/lib/components/RepuestoCard.svelte -->
<script>
  import { cart } from '$stores/cart';

  export let repuesto;

  function agregar() {
    cart.update(items => [...items, repuesto]);
  }
</script>

<div class="card">
  <h3>{repuesto.nombre}</h3>
  <p>{repuesto.descripcion}</p>
  <p><strong>Precio: ${repuesto.precio}</strong></p>
  <button on:click={agregar}>Agregar a cotización</button>
</div>
<!-- src/lib/components/AddToQuoteButton.svelte -->
<script>
  import { addToCart } from '$lib/stores/cart.js';
  export let repuesto;
  function handleClick() {
    addToCart(repuesto);
    alert(`✅ "${repuesto.nombre}" agregado a la cotización`);
  }
</script>

<button
  on:click={handleClick}
  style="
    background: #0d6efd;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
    width: 100%;
  "
>
  💰 Agregar a cotización
</button>
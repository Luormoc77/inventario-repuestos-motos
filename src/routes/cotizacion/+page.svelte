<!-- src/routes/cotizacion/+page.svelte -->
<script>
  export const ssr = false;
  export const prerender = false;

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { cart, cartInitialized, clearCart } from '$lib/stores/cart.js';

  let showRestoredMessage = false;

  // Calcular total
  $: total = $cart.reduce((sum, item) => sum + item.precio, 0);

  // Mostrar mensaje si hay cotización guardada
  onMount(() => {
    const unsubscribe = cartInitialized.subscribe(initialized => {
      if (initialized && $cart.length > 0) {
        showRestoredMessage = true;
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          showRestoredMessage = false;
        }, 3000);
      }
    });
    return () => unsubscribe();
  });

  function handleClear() {
    if (confirm('¿Vaciar toda la cotización?')) {
      clearCart();
      showRestoredMessage = false;
    }
  }

  function handleContinueShopping() {
    goto('/');
  }
</script>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .quote-header {
    text-align: center;
    margin-bottom: 30px;
  }
  .restored-message {
    background: #d4edda;
    color: #155724;
    padding: 12px;
    border-radius: 6px;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
    animation: fadeIn 0.5s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .quote-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
  .quote-item-name {
    font-weight: bold;
  }
  .quote-total {
    text-align: right;
    font-size: 1.5em;
    font-weight: bold;
    color: #28a745;
    margin: 20px 0;
  }
  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 30px;
  }
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  .btn-primary {
    background: #0d6efd;
    color: white;
  }
  .btn-secondary {
    background: #6c757d;
    color: white;
  }
  .empty {
    text-align: center;
    padding: 40px;
    color: #6c757d;
  }
  .back-link {
    display: block;
    text-align: center;
    margin-bottom: 20px;
    color: #0d6efd;
    text-decoration: none;
    font-weight: bold;
  }
</style>

<div class="container">
  <a href="/" class="back-link">← Volver al inventario</a>

  <div class="quote-header">
    <h1>📄 Tu Cotización</h1>
    <p>Resumen de repuestos seleccionados</p>
  </div>

  <!-- Mensaje de restauración -->
  {#if showRestoredMessage}
    <div class="restored-message">
      ✅ ¡Cotización restaurada desde tu última visita!
    </div>
  {/if}

  {#if $cart.length === 0}
    <div class="empty">
      <p>📭 No has agregado ningún repuesto a la cotización.</p>
      <button class="btn-primary" on:click={handleContinueShopping}>
        ➕ Seguir comprando
      </button>
    </div>
  {:else}
    <div class="quote-items">
      {#each $cart as item, i}
        <div class="quote-item">
          <span class="quote-item-name">
            {i + 1}. {item.nombre} ({item.marca} {item.modelo_moto})
          </span>
          <span>${item.precio.toFixed(2)}</span>
        </div>
      {/each}
    </div>

    <div class="quote-total">
      Total: ${total.toFixed(2)}
    </div>

    <div class="actions">
      <button class="btn-secondary" on:click={handleClear}>
        🗑️ Vaciar cotización
      </button>
      <button class="btn-primary" on:click={handleContinueShopping}>
        ➕ Agregar más repuestos
      </button>
    </div>
  {/if}
</div>
<script>
  import { navigating } from '$app/stores';
  import "../app.css";

</script>
 
 

{#if $navigating}
  <p>Loading...</p>
{:else}
  <slot />
{/if}

<style>
  nav {
    padding: 1rem;
    background-color: #f0f0f0;
  }
  nav a {
    margin-right: 1rem;
  }
</style>

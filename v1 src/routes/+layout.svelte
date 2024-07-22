<script>
  import { navigating } from '$app/stores';
</script>

<nav>
  <a href="/">Home</a>
  <a href="/projects">Projects</a>
</nav>

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

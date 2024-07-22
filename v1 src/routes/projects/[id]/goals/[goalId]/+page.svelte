<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getGoal } from '$lib/api';

  let goal = null;

  onMount(async () => {
    goal = await getGoal($page.params.id, $page.params.goalId);
  });
</script>

{#if goal}
  <h1>{goal.title}</h1>
  <p>Status: {goal.status}</p>
  <!-- Add more goal details and functionality as needed -->
{:else}
  <p>Loading goal...</p>
{/if}

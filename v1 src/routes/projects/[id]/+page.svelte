 <script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getProject, createGoal, generateGoalSuggestion } from '$lib/api';

  let project = null;
  let newGoalTitle = '';
  let generatedSuggestion = '';

  onMount(async () => {
    project = await getProject($page.params.id);
  });

  async function handleCreateGoal() {
    if (newGoalTitle) {
      const newGoal = await createGoal($page.params.id, newGoalTitle);
      project.goals = [...project.goals, newGoal];
      newGoalTitle = '';
    }
  }

  async function handleGenerateSuggestion() {
    const { suggestion } = await generateGoalSuggestion($page.params.id);
    generatedSuggestion = suggestion;
    newGoalTitle = suggestion;
  }
</script>

{#if project}
  <h1>{project.name}</h1>

  <h2>Goals</h2>
  <form on:submit|preventDefault={handleCreateGoal}>
    <input bind:value={newGoalTitle} placeholder="New goal title" />
    <button type="submit">Create Goal</button>
    <button type="button" on:click={handleGenerateSuggestion}>Generate Suggestion</button>
  </form>

  {#if generatedSuggestion}
    <p>Generated suggestion: {generatedSuggestion}</p>
  {/if}

  <ul>
    {#each project.goals as goal}
      <li>
        <a href="/projects/{project._id}/goals/{goal._id}">{goal.title}</a>
      </li>
    {/each}
  </ul>
{:else}
  <p>Loading project...</p>
{/if}

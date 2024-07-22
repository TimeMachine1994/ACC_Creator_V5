<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
 
  let projectId;
  let project = {};
  let goals = [];

  $: projectId = $page.params.id;

  onMount(async () => {
    const response = await fetch(`/api/projects/${projectId}`);
    const data = await response.json();
    project = data.project;
    goals = data.goals;
  });

 
</script>

<section class="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
  <header class="mb-6">
    <h1 class="text-4xl font-bold">{project.name}</h1>
  </header>

  <div class="mb-6 bg-white p-4 rounded-lg shadow">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-semibold">Program Summary</h2>
      <button 
        class="bg-white border border-gray-300 px-3 py-1 rounded shadow hover:bg-gray-100"
        on:click={editSummary}
      >
        Edit
      </button>
    </div>
    <div class="p-4 bg-gray-200 rounded">
      <p>{project.summary}</p>
    </div>
  </div>

  <div class="bg-white p-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-2">Goals</h2>
    <button 
      class="w-full mb-4 bg-white border border-gray-300 px-3 py-2 rounded shadow hover:bg-gray-100 flex items-center justify-center"
      on:click={addNewGoal}
    >
      <span class="mr-2">+</span> New Goal
    </button>
    <ul>
      {#each goals as goal}
        <li 
          class="bg-gray-200 p-4 mb-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-300"
        >
          <span>{goal.name}</span>
          <button 
            class="bg-white border border-gray-300 px-2 py-1 rounded shadow hover:bg-gray-100"
            on:click={() => deleteGoal(goal.id)}
          >
            x
          </button>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  /* Additional custom styles if needed */
</style>

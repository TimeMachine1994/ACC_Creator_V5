<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { createGoal, getProject, updateProject, deleteGoal } from '$lib/api';
  import GoalDetails from './goals/[id]/+page.svelte';
  import { writable } from 'svelte/store';

  export let data;

  let projectId;
  let project = writable({ name: '', summary: '' });
  let goals = writable([]);
  let editingTitle = writable(false);
  let editingSummary = writable(false);
  let selectedGoal = writable(null);

  let editedName = writable('');
  let editedSummary = writable('');

  $: projectId = $page.params.id;

  onMount(async () => {
    const data = await getProject(projectId);
    project.set(data.project);
    goals.set(data.goals);
    editedName.set(data.project.name || '');
    editedSummary.set(data.project.summary || '');
  });

  async function saveTitle() {
    await updateProject(projectId, { name: $editedName });
    project.update(p => ({ ...p, name: $editedName }));
    editingTitle.set(false);
  }

  async function saveSummary() {
    await updateProject(projectId, { summary: $editedSummary });
    project.update(p => ({ ...p, summary: $editedSummary }));
    editingSummary.set(false);
  }

  async function addNewGoal() {
    const newGoal = await createGoal(projectId, 'New Goal');
    goals.update(gs => [...gs, newGoal]);
    selectedGoal.set(newGoal);
    goto(`/projects/${projectId}/goals/${newGoal._id}`, { replaceState: true, state: { goal: newGoal } });
  }

  async function removeGoal(goalId) {
    await deleteGoal(projectId, goalId);
    goals.update(gs => gs.filter(goal => goal._id !== goalId));
  }

  function navigateToGoal(goalId) {
    selectedGoal.set($goals.find(goal => goal._id === goalId));
    goto(`/projects/${projectId}/goals/${goalId}`);
  }
</script>

{#if $selectedGoal}
  <GoalDetails goal={$selectedGoal} on:back={() => selectedGoal.set(null)} />
{:else}
  <section class="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
    <header class="mb-6">
      {#if $editingTitle}
        <input
          bind:value={$editedName}
          class="text-4xl font-bold w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
          on:blur={saveTitle}
        />
      {:else}
        <h1 class="text-4xl font-bold cursor-pointer" on:click={() => editingTitle.set(true)}>
          {$project.name || 'Untitled Project'}
        </h1>
      {/if}
    </header>

    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-2">Program Summary</h2>
      <div class="p-4 bg-gray-200 rounded relative">
        {#if $editingSummary}
          <textarea
            bind:value={$editedSummary}
            class="w-full bg-transparent resize-none focus:outline-none"
            rows="4"
          ></textarea>
          <button
            class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 focus:outline-none"
            on:click={saveSummary}
          >
            ✓
          </button>
        {:else}
          <p class="cursor-pointer" on:click={() => editingSummary.set(true)}>
            {$project.summary || 'Click to add a summary'}
          </p>
        {/if}
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-2">Goals</h2>
      <button
        class="w-full mb-4 bg-white border border-gray-300 px-3 py-2 rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        on:click={addNewGoal}
      >
        <span class="mr-2">+</span> New Goal
      </button>
      <ul>
        {#each $goals as goal}
          <li
            class="bg-gray-200 p-4 mb-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-300"
            on:click={() => navigateToGoal(goal._id)}
          >
            <span>{goal.title}</span>
            <button
              class="bg-white border border-gray-300 px-2 py-1 rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              on:click|stopPropagation={() => removeGoal(goal._id)}
            >
              x
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { chatCompletion } from '$lib/api';
  import { getGoal, updateGoal, deleteGoal } from '$lib/api';
  import type { Goal, Chat, Note } from '$lib/types';
  export let goal: Goal;

  let projectId: string;
  let goalId: string;
  let chat: Chat[] = [];
  let notes: Note[] = [];
  let newMessage: string = '';
  let loading: boolean = true;
  let error: string | null = null;

  $: projectId = $page.params.projectId;
  $: goalId = $page.params.goalId;

  onMount(async () => {
    if (projectId && goalId) {
      try {
        const response = getGoal(projectId, goalId);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        goal = data.goal;
        chat = data.chat || [];
        notes = data.notes || [];
       } catch (err) {
        console.error('Error fetching data:', err);
        error = 'Failed to load data';
        loading = false;
      }
    }
  });

  async function addNewChat() {
    if (!newMessage.trim()) return;
    try {
      const response = await chatCompletion(projectId, goalId, newMessage);
      chat = [...chat, { user: 'User', text: newMessage }, { user: 'AI', text: response }];
      newMessage = '';
    } catch (err) {
      error = 'Failed to send message';
    }
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p>Error: {error}</p>
{:else}
  <section class="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
    <header class="mb-6 text-center">
      <h1 class="text-4xl font-bold">{goal.name}</h1>
      <h2 class="text-2xl text-gray-700">{projectId}</h2>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="md:col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Goal Summary</h2>
        <div class="p-4 bg-gray-200 rounded">
          <p>{goal.summary}</p>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Notes</h2>
        <div class="p-4 bg-gray-200 rounded mb-4">
          {#each notes as note}
            <div class="bg-gray-100 p-4 mb-2 rounded">
              <p class="text-red-500">{note.response}</p>
              <input
                class="w-full mt-2 p-2 bg-white border border-gray-300 rounded"
                type="text"
                placeholder="User Note Input"
                bind:value={note.userNote}
              />
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-2">Chat</h2>
      <div class="flex items-center mb-4">
        <input
          class="w-full p-2 border border-gray-300 rounded-l"
          type="text"
          placeholder="Type a message..."
          bind:value={newMessage}
        />
        <button
          class="bg-gray-300 p-2 rounded-r hover:bg-gray-400"
          on:click={addNewChat}
        >
          <span class="mr-2">+</span>
        </button>
      </div>
      <ul>
        {#each chat as message}
          <li class="bg-gray-200 p-4 mb-2 rounded">
            <span class="font-bold">{message.user}</span>: {message.text}
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

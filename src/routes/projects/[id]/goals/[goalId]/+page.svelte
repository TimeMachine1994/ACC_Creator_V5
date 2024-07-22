<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let projectId;
  let goalId;
  let chatId;
  let goal = {};
  let chat = [];
  let notes = [];

  $: projectId = $page.params.projectId;
  $: goalId = $page.params.goalId;
  $: chatId = $page.params.chatId;

  onMount(async () => {
    const response = await fetch(`/api/projects/${projectId}/goals/${goalId}/chats/${chatId}`);
    const data = await response.json();
    goal = data.goal;
    chat = data.chat;
    notes = data.notes;
  });

  function addNewChat() {
    // Function to handle adding a new chat
    console.log('Add new chat');
  }
</script>

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
              value={note.userNote} 
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

<style>
  /* Additional custom styles if needed */
</style>

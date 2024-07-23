<script>
  import { onMount } from 'svelte';
  import { getProjects, createProject } from '$lib/api';

  let projects = [];
  let newProjectName = '';
  let loading = true;

  onMount(async () => {
    try {
      projects = await getProjects();
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      loading = false;
    }
  });

  async function createNewProject() {
    if (!newProjectName.trim()) {
      alert('Project name cannot be empty.');
      return;
    }

    try {
      const newProject = await createProject({ name: newProjectName });
      if (newProject && newProject._id) {
        goToProject(newProject._id);
      } else {
        throw new Error('Failed to create project.');
      }
    } catch (error) {
      console.error('Failed to create new project:', error);
      alert(`Failed to create new project: ${error.message}`);
    } finally {
      newProjectName = ''; // Clear the input field
    }
  }

  function goToProject(projectId) {
    window.location.href = `/projects/${projectId}`;
  }
</script>

<section class="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
  <header class="mb-6 text-center">
    <h1 class="text-4xl font-bold">ACC Creator</h1>
  </header>

  <div class="flex justify-between items-center mb-6">
    <input 
      type="text" 
      class="w-full p-2 mr-2 border border-gray-300 rounded" 
      placeholder="Enter project name" 
      bind:value={newProjectName} 
    />
    <button 
      class="bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100"
      on:click={createNewProject}
    >
      New
    </button>
  </div>

  <div class="bg-white p-4 rounded-lg shadow">
    {#if loading}
      <p class="text-lg text-center">Loading projects...</p>
    {:else if projects.length === 0}
      <p class="text-lg text-center">No projects available. Create a new one!</p>
    {:else}
      <ul>
        {#each projects as project}
          <li 
            class="bg-gray-200 p-4 mb-2 rounded cursor-pointer hover:bg-gray-300"
            on:click={() => goToProject(project._id)}
          >
            {project.name}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

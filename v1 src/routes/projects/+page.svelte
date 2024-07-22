<script>
  import { onMount } from 'svelte';
  import { getProjects, createProject, generateProjectIdea } from '$lib/api';

  let projects = [];
  let newProjectName = '';
  let generatedIdea = '';

  onMount(async () => {
    projects = await getProjects();
  });

  async function handleCreateProject() {
    if (newProjectName) {
      const newProject = await createProject(newProjectName);
      projects = [...projects, newProject];
      newProjectName = '';
    }
  }

  async function handleGenerateIdea() {
    const { idea } = await generateProjectIdea();
    generatedIdea = idea;
    newProjectName = idea;
  }
</script>

<h1>Projects</h1>

<form on:submit|preventDefault={handleCreateProject}>
  <input bind:value={newProjectName} placeholder="New project name" />
  <button type="submit">Create Project</button>
  <button type="button" on:click={handleGenerateIdea}>Generate Idea</button>
</form>

{#if generatedIdea}
  <p>Generated idea: {generatedIdea}</p>
{/if}

<ul>
  {#each projects as project}
    <li>
      <a href="/projects/{project._id}">{project.name}</a>
    </li>
  {/each}
</ul>

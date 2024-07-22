const API_URL = 'http://localhost:3000/api';

export async function getProjects() {
  const response = await fetch(`${API_URL}/projects`);
  return response.json();
}

export async function createProject(name) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return response.json();
}

export async function getProject(id) {
  const response = await fetch(`${API_URL}/projects/${id}`);
  return response.json();
}

export async function createGoal(projectId, title) {
  const response = await fetch(`${API_URL}/projects/${projectId}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return response.json();
}

export async function getGoal(projectId, goalId) {
  const response = await fetch(`${API_URL}/projects/${projectId}/goals/${goalId}`);
  return response.json();
}

export async function generateProjectIdea() {
  const response = await fetch('/api/projects/generate-idea');
  return response.json();
}

export async function generateGoalSuggestion(projectId) {
  const response = await fetch(`/api/projects/${projectId}/goals/generate-suggestion`);
  return response.json();
}
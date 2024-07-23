const API_URL = 'http://localhost:3000/api';
import OpenAI from "openai";
//new code for open ai stuff 
export async function chatCompletion() {
  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}


//old code that works 
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

export async function updateProject(id, data) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
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

export async function updateGoal(projectId, goalId, data) {
  const response = await fetch(`${API_URL}/projects/${projectId}/goals/${goalId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteGoal(projectId, goalId) {
  const response = await fetch(`${API_URL}/projects/${projectId}/goals/${goalId}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function generateProjectIdea() {
  const response = await fetch(`${API_URL}/projects/generate-idea`);
  return response.json();
}

export async function generateGoalSuggestion(projectId) {
  const response = await fetch(`${API_URL}/projects/${projectId}/goals/generate-suggestion`);
  return response.json();
}

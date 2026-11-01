import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';

function mountDemo(): ReturnType<typeof mount> {
  const target = document.getElementById('app');

  if (!target) {
    throw new Error('The demo application mount point was not found.');
  }

  return mount(App, { target });
}

const app = mountDemo();

export default app;

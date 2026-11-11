// main.js: the app's brain. It owns the state, listens for events,
// calls api.js to talk to the server and render.js to update the page.

import {
  BASE_URL, ApiError, setSimulatedError,
  listPlants, getPlant, createPlant, updatePlant, patchPlant, deletePlant, listCategories,
} from './api.js';
import {
  renderPlantList, renderStatus, renderPager, renderDetail, renderCategoryOptions,
  renderMessage, showForm, hideForm, setFormBusy, showFieldErrors,
} from './render.js';

// ---------- state: one object the whole page is drawn from ----------

const state = {
  plants: [],       // the current page of plants, exactly as the server sent them
  total: 0,
  page: 1,
  pages: 1,
  limit: 5,
  q: '',
  category: '',
  status: 'idle',   // 'loading' | 'ready' | 'error'
  error: null,
  selectedId: null,
  editingId: null,  // null = not editing, 'new' = creating, a number = editing that plant
};

const filtersForm = document.querySelector('#filters');
const searchInput = document.querySelector('#search');
const categorySelect = document.querySelector('#category');
const limitSelect = document.querySelector('#limit');
const listEl = document.querySelector('#plant-list');
const detailEl = document.querySelector('#detail');
const form = document.querySelector('#plant-form');

function renderList() {
  renderStatus(state);
  renderPager(state);
  renderPlantList(state.plants, state.selectedId);
}

// ---------- loading the list ----------

let latestRequest = 0; // to ignore answers that arrive out of order

async function loadPlants() {
  const requestNumber = ++latestRequest;
  state.status = 'loading';
  renderList();
  try {
    const result = await listPlants(state);
    if (requestNumber !== latestRequest) return; // a newer request has started: ignore this old answer

    // Deleted the last plant on the last page? Step back one page and try again.
    if (result.items.length === 0 && result.page > 1) {
      state.page = result.pages;
      return loadPlants();
    }
    Object.assign(state, { plants: result.items, total: result.total, pages: result.pages, page: result.page });
    state.status = 'ready';
    state.error = null;
  } catch (error) {
    if (requestNumber !== latestRequest) return;
    state.status = 'error';
    state.error = error;
  }
  renderList();
}

// ---------- master/detail ----------

async function selectPlant(id) {
  state.selectedId = id;
  state.editingId = null;
  hideForm();
  renderPlantList(state.plants, state.selectedId);
  renderDetail({ loading: true });
  try {
    const plant = await getPlant(id); // fresh copy from the server
    if (state.selectedId !== id) return; // the user clicked another plant meanwhile
    renderDetail({ plant });
  } catch (error) {
    renderDetail({ error });
  }
}

listEl.addEventListener('click', (event) => {
  const card = event.target.closest('.plant-card');
  if (!card) return;
  const id = Number(card.dataset.id);
  if (event.target.closest('.plant-fav')) {
    toggleFavourite(id);
  } else {
    selectPlant(id);
  }
});

detailEl.addEventListener('click', (event) => {
  const article = event.target.closest('.plant-detail');
  if (!article) return;
  const id = Number(article.dataset.id);
  if (event.target.closest('.edit')) startEdit(id);
  if (event.target.closest('.delete')) removePlant(id);
});

// ---------- create and update (confirm-then-update) ----------

document.querySelector('#new-plant').addEventListener('click', () => {
  state.editingId = 'new';
  showForm(null);
});

async function startEdit(id) {
  try {
    const plant = await getPlant(id);
    state.editingId = id;
    showForm(plant);
  } catch (error) {
    renderDetail({ error });
  }
}

document.querySelector('#cancel').addEventListener('click', () => {
  state.editingId = null;
  hideForm();
});

// Form values are always strings. The API wants numbers for price and stock.
function readForm() {
  const data = new FormData(form);
  return {
    name: data.get('name').trim(),
    category: data.get('category'),
    price: data.get('price') === '' ? null : Number(data.get('price')),
    stock: data.get('stock') === '' ? null : Number(data.get('stock')),
    notes: data.get('notes').trim(),
  };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const plant = readForm();
  const editingId = state.editingId;
  const editing = editingId !== 'new';
  if (editing) {
    // PUT replaces the whole record, so send favourite too or it resets to false.
    plant.favourite = state.plants.find((p) => p.id === editingId)?.favourite ?? false;
  }

  setFormBusy(true);
  try {
    const saved = editing ? await updatePlant(editingId, plant) : await createPlant(plant);
    // Success: the server's answer is the truth (it has the id, the trimmed text...).
    state.editingId = null;
    hideForm();
    if (editing) {
      // Update in place: swap the old object for the server's version, then re-render.
      state.plants = state.plants.map((p) => (p.id === saved.id ? saved : p));
      renderList();
    } else {
      // A new plant may belong on another page or be filtered out: ask the server again.
      await loadPlants();
    }
    state.selectedId = saved.id;
    renderPlantList(state.plants, state.selectedId);
    renderDetail({ plant: saved });
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      showFieldErrors(error.body?.fields, 'Please fix the highlighted fields.');
    } else {
      showFieldErrors({}, `Save failed: ${error.message}`);
    }
  } finally {
    setFormBusy(false);
  }
});

// ---------- delete (confirm-then-update) ----------

async function removePlant(id) {
  const plant = state.plants.find((p) => p.id === id);
  if (!confirm(`Delete ${plant?.name ?? 'this plant'}? This can't be undone.`)) return;
  try {
    await deletePlant(id);           // wait for the server to say yes (204)...
    state.selectedId = null;
    renderDetail({});
    await loadPlants();              // ...then update the page from fresh data
  } catch (error) {
    renderDetail({ error: new Error(`Delete failed: ${error.message}`) });
  }
}

// ---------- favourite (optimistic, with rollback) ----------

async function toggleFavourite(id) {
  const plant = state.plants.find((p) => p.id === id);
  if (!plant) return;
  const before = plant.favourite;

  plant.favourite = !before;         // 1. change the screen right away
  renderPlantList(state.plants, state.selectedId);
  try {
    await patchPlant(id, { favourite: plant.favourite }); // 2. tell the server
  } catch (error) {
    plant.favourite = before;        // 3. it failed: put it back and say so
    renderPlantList(state.plants, state.selectedId);
    renderMessage(`Favourite not saved: ${error.message}`, 'error');
  }
}

// ---------- search, filter, pagination ----------

let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);            // debounce: wait until typing pauses
  searchTimer = setTimeout(() => {
    state.q = searchInput.value.trim();
    state.page = 1;
    syncUrl();
    loadPlants();
  }, 300);
});

categorySelect.addEventListener('change', () => {
  state.category = categorySelect.value;
  state.page = 1;
  syncUrl();
  loadPlants();
});

limitSelect.addEventListener('change', () => {
  state.limit = Number(limitSelect.value);
  state.page = 1;
  syncUrl();
  loadPlants();
});

filtersForm.addEventListener('submit', (event) => event.preventDefault()); // Enter in search

document.querySelector('#prev').addEventListener('click', () => { state.page -= 1; syncUrl(); loadPlants(); });
document.querySelector('#next').addEventListener('click', () => { state.page += 1; syncUrl(); loadPlants(); });
document.querySelector('#retry').addEventListener('click', loadPlants);

// Keep the filters in the address bar, so reload and copy-paste keep your place.
function syncUrl() {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.category) params.set('category', state.category);
  if (state.page > 1) params.set('page', state.page);
  if (state.limit !== 5) params.set('limit', state.limit);
  const query = params.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
}

function readUrl() {
  const params = new URLSearchParams(location.search);
  state.q = params.get('q') ?? '';
  state.category = params.get('category') ?? '';
  state.page = Number(params.get('page')) || 1;
  state.limit = Number(params.get('limit')) || 5;
  searchInput.value = state.q;
  limitSelect.value = String(state.limit);
}

// ---------- teaching tools ----------

const debugOutput = document.querySelector('#debug-output');

document.querySelector('#simulate-500').addEventListener('change', (event) => {
  setSimulatedError(event.target.checked ? '500' : '');
});

// These use fetch directly (not api()) so they can make the mistakes on purpose.
const debugRequests = {
  404: () => fetch(`${BASE_URL}/plants/9999`),
  400: () => fetch(`${BASE_URL}/plants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Mystery', category: 'cactus', price: '12.50', stock: 1 }),
  }),
  'no-stringify': () => fetch(`${BASE_URL}/plants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { name: 'Oops', category: 'cactus', price: 1, stock: 1 }, // becomes "[object Object]"
  }),
  415: () => fetch(`${BASE_URL}/plants`, {
    method: 'POST',
    body: JSON.stringify({ name: 'No header', category: 'cactus', price: 1, stock: 1 }),
  }),
};

document.querySelector('.tools').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-debug]');
  if (!button) return;
  const kind = button.dataset.debug;
  debugOutput.textContent = 'Sending…';

  try {
    if (kind === 'no-ok') {
      // The classic bug: no response.ok check, so a 404 body looks like "data".
      const response = await fetch(`${BASE_URL}/plants/9999`);
      const plant = await response.json();
      debugOutput.textContent =
        `No error was thrown! fetch resolved with status ${response.status}.\n` +
        `plant.name is ${plant.name} because the "plant" is really: ${JSON.stringify(plant)}`;
      return;
    }
    const response = await debugRequests[kind]();
    const body = await response.text();
    debugOutput.textContent = `${response.status} ${response.statusText}\n${body}`;
  } catch (error) {
    debugOutput.textContent = `fetch rejected: ${error.message} (is the server running?)`;
  }
});

document.querySelector('#load-about').addEventListener('click', async () => {
  const about = document.querySelector('#about');
  try {
    const response = await fetch('about.md');          // same server, a plain file
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    about.textContent = await response.text();          // .text(), not .json()
  } catch (error) {
    about.textContent = `Couldn't load about.md: ${error.message}`;
  }
});

// ---------- start ----------

async function start() {
  readUrl();
  try {
    const categories = await listCategories();
    renderCategoryOptions(categorySelect, categories.items);
    renderCategoryOptions(form.elements.category, categories.items);
    categorySelect.value = state.category;
  } catch (error) {
    console.warn('Categories did not load:', error.message);
  }
  await loadPlants();
}

start();

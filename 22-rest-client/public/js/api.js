// api.js: everything that talks to the server lives here.
// No DOM code in this file. It only sends requests and returns data (or throws).

export const BASE_URL = 'http://localhost:3000/api';

// An Error that also remembers the HTTP status and the server's JSON body.
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // 0 means "never reached the server"
    this.body = body;     // e.g. { error: 'Validation failed', fields: { name: '...' } }
  }
}

// Teaching switch for the debug panel: make the next writes fail on purpose.
let simulatedError = '';
export function setSimulatedError(code) {
  simulatedError = code;
}

// The one helper every request goes through.
//   api('/plants')                                   -> GET
//   api('/plants', { method: 'POST', body: plant })  -> POST with a JSON body
export async function api(path, options = {}) {
  const { body, headers = {}, ...rest } = options;
  const init = { ...rest, headers: { Accept: 'application/json', ...headers } };

  if (body !== undefined) {
    init.body = JSON.stringify(body);              // objects must become text
    init.headers['Content-Type'] = 'application/json'; // and we must say it is JSON
  }
  if (simulatedError && init.method && init.method !== 'GET') {
    init.headers['X-Simulate-Error'] = simulatedError;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, init);
  } catch {
    // fetch only rejects when there is no response at all:
    // server stopped, wrong port, offline, or blocked by CORS.
    throw new ApiError('Could not reach the server. Is it running (npm start)?', 0, null);
  }

  // 204 No Content has an empty body, so .json() would throw. Read text first.
  const text = await response.text();
  const isJson = (response.headers.get('Content-Type') ?? '').includes('application/json');
  const data = text === '' ? null : isJson ? JSON.parse(text) : text;

  if (!response.ok) {
    // fetch does NOT throw for 404 or 500. We have to check response.ok ourselves.
    const message = data?.error ?? `${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status, data);
  }
  return data;
}

// Small, named functions for each thing the app does.
// main.js reads like a story because of these.

export function listPlants({ q = '', category = '', page = 1, limit = 5 } = {}) {
  const params = new URLSearchParams({ _page: page, _limit: limit, _sort: 'name' });
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  return api(`/plants?${params}`); // -> { items, total, page, limit, pages }
}

export const getPlant = (id) => api(`/plants/${id}`);
export const createPlant = (plant) => api('/plants', { method: 'POST', body: plant });
export const updatePlant = (id, plant) => api(`/plants/${id}`, { method: 'PUT', body: plant });
export const patchPlant = (id, changes) => api(`/plants/${id}`, { method: 'PATCH', body: changes });
export const deletePlant = (id) => api(`/plants/${id}`, { method: 'DELETE' });
export const listCategories = () => api('/categories');

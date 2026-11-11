// Demo 20: the Fetch API and asynchronous client code (SDEV1150, Day 21)
//
// Front-end development = JavaScript in the browser, working on HTML and CSS.
// Today the browser also talks to a server: it asks for data, waits, then
// updates the page. Every section below matches a box on the page.
//
// Run it:  Live Server on index.html  (sections 5 and 6 fall back gracefully)
//     or:  npm start, then open http://localhost:3020  (everything works)

// ---------- Elements ----------
const slowBox = document.querySelector('#slow');
const serverMode = document.querySelector('#server-mode');

// ---------- Small helpers ----------

// A promise that fulfils after ms milliseconds. Used to fake a slow network.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// If "Slow network" is ticked, pause for one second first.
async function maybeSlow() {
  if (slowBox.checked) await wait(1000);
}

// Put a message in a status line and set its state class.
// state is one of: 'loading', 'success', 'empty', 'error', or '' (clear).
function setStatus(element, state, message) {
  element.className = `status ${state}`;
  element.textContent = message;
}

// The one fetch helper we reuse everywhere:
// fetch, check response.ok, parse JSON, return the data.
async function getJSON(url, options) {
  await maybeSlow();
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

// Builds one menu card: <li>Name <span class="price">$x.xx</span> <span class="vegan">vegan</span></li>
function buildMenuItem(item) {
  const li = document.createElement('li');
  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = `$${item.price.toFixed(2)}`;
  li.append(price, item.name);
  if (item.vegan) {
    const tag = document.createElement('span');
    tag.className = 'vegan';
    tag.textContent = 'vegan';
    li.append(' ', tag);
  }
  return li;
}

// =====================================================================
// 1. The restaurant pager: sync vs async
// =====================================================================
const pagerLog = document.querySelector('#pager-log');

function log(message) {
  const li = document.createElement('li');
  li.textContent = message;
  pagerLog.append(li);
}

document.querySelector('#btn-async').addEventListener('click', () => {
  log('Order placed. Here is your pager.');
  fetch('data/menu.json')                      // starts the request, returns a Promise right away
    .then((response) => response.json())
    .then((items) => log(`BUZZ! Food is ready: the menu has ${items.length} items.`));
  log('You sit down and chat (this line runs BEFORE the buzz).');
});

document.querySelector('#btn-sync').addEventListener('click', () => {
  log('Standing at the counter… (the page is frozen)');
  const stopAt = Date.now() + 2000;
  while (Date.now() < stopAt) {
    // A busy loop: JavaScript can do nothing else, so clicks and typing wait.
  }
  log('Food ready. Now the page can move again.');
});

document.querySelector('#btn-clear-log').addEventListener('click', () => pagerLog.replaceChildren());

// =====================================================================
// 2. Load on page load, with loading / empty / error / success states
// =====================================================================
const menuStatus = document.querySelector('#menu-status');
const menuList = document.querySelector('#menu-list');
const reloadButton = document.querySelector('#btn-reload-menu');

async function loadMenu() {
  setStatus(menuStatus, 'loading', 'Loading the menu…');
  menuList.replaceChildren();
  reloadButton.disabled = true;            // no double clicks while we wait

  try {
    const items = await getJSON('data/menu.json');
    if (items.length === 0) {
      setStatus(menuStatus, 'empty', 'The menu is empty today.');
      return;
    }
    menuList.append(...items.map(buildMenuItem));
    setStatus(menuStatus, 'success', `${items.length} items on the menu.`);
  } catch (error) {
    console.error(error);
    setStatus(menuStatus, 'error', 'Could not load the menu. Check the Console and try again.');
  } finally {
    reloadButton.disabled = false;         // runs after success AND after failure
  }
}

reloadButton.addEventListener('click', loadMenu);
loadMenu();                                // on page load

// =====================================================================
// 3. The same request with .then() and with async/await
// =====================================================================
const specialsStatus = document.querySelector('#specials-status');
const specialsList = document.querySelector('#specials-list');

function showSpecials(data, how) {
  specialsList.replaceChildren(...data.items.map((special) => {
    const li = document.createElement('li');
    li.textContent = special.deal;
    return li;
  }));
  setStatus(specialsStatus, 'success', `${data.day} specials (loaded with ${how})`);
}

// Style 1: a .then() chain
document.querySelector('#btn-then').addEventListener('click', () => {
  setStatus(specialsStatus, 'loading', 'Loading…');
  fetch('data/specials.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();              // return the next promise to keep the chain going
    })
    .then((data) => showSpecials(data, '.then()'))
    .catch((error) => setStatus(specialsStatus, 'error', error.message));
});

// Style 2: async/await (reads top to bottom, like normal code)
document.querySelector('#btn-await').addEventListener('click', async () => {
  setStatus(specialsStatus, 'loading', 'Loading…');
  try {
    const response = await fetch('data/specials.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    showSpecials(data, 'async/await');
  } catch (error) {
    setStatus(specialsStatus, 'error', error.message);
  }
});

// =====================================================================
// 4. When things go wrong: 404, broken JSON, network failure
// =====================================================================
const checkOk = document.querySelector('#check-ok');
const errorOutput = document.querySelector('#error-output');

document.querySelector('#errors-section .row').addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const url = button.dataset.url;
  const lines = [`fetch('${url}')`];
  errorOutput.textContent = 'Loading…';

  try {
    const response = await fetch(url);
    lines.push(`→ fetch FULFILLED. status: ${response.status}, ok: ${response.ok}`);
    if (checkOk.checked && !response.ok) {
      throw new Error(`HTTP ${response.status}: we threw this ourselves`);
    }
    const data = await response.json();
    lines.push(`→ response.json() worked. Got ${Array.isArray(data) ? `an array of ${data.length}` : 'an object'}.`);
  } catch (error) {
    lines.push(`→ CAUGHT ${error.name}: ${error.message}`);
    console.error(error);
  }
  errorOutput.textContent = lines.join('\n');
});

// =====================================================================
// 5. Form submit + URLSearchParams (query string)
// =====================================================================
const searchForm = document.querySelector('#search-form');
const searchUrl = document.querySelector('#search-url');
const searchStatus = document.querySelector('#search-status');
const searchList = document.querySelector('#search-list');
const searchButton = document.querySelector('#btn-search');

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();                  // no page reload: we fetch instead
  const q = document.querySelector('#search-q').value.trim();
  const category = document.querySelector('#search-category').value;

  const params = new URLSearchParams({ q, category });
  const url = `api/menu?${params}`;        // e.g. api/menu?q=oat+latte&category=drink
  searchUrl.textContent = url;

  searchButton.disabled = true;
  setStatus(searchStatus, 'loading', 'Searching…');
  searchList.replaceChildren();

  try {
    let items;
    let note = '';
    try {
      items = await getJSON(url);          // the real API (npm start)
    } catch {
      // Live Server has no /api, so fall back: load the file and filter in the browser.
      const all = await getJSON('data/menu.json');
      items = all.filter((item) =>
        item.name.toLowerCase().includes(q.toLowerCase()) && (category === '' || item.category === category));
      note = ' (filtered in the browser: the API is not running)';
    }
    if (items.length === 0) {
      setStatus(searchStatus, 'empty', `No matches${note}.`);
    } else {
      searchList.append(...items.map(buildMenuItem));
      setStatus(searchStatus, 'success', `${items.length} found${note}.`);
    }
  } catch (error) {
    setStatus(searchStatus, 'error', `Search failed: ${error.message}`);
  } finally {
    searchButton.disabled = false;
  }
});

// =====================================================================
// 6. POST an order (needs npm start)
// =====================================================================
const orderForm = document.querySelector('#order-form');
const orderItem = document.querySelector('#order-item');
const orderQty = document.querySelector('#order-qty');
const orderButton = document.querySelector('#btn-order');
const orderStatus = document.querySelector('#order-status');
const orderOutput = document.querySelector('#order-output');
const orderList = document.querySelector('#order-list');

async function fillOrderItems() {
  try {
    const items = await getJSON('data/menu.json');
    orderItem.append(...items.map((item) => new Option(`${item.name} ($${item.price.toFixed(2)})`, item.id)));
  } catch {
    orderItem.append(new Option('(menu did not load)', ''));
  }
}

async function loadOrders() {
  try {
    const orders = await getJSON('api/orders');
    orderList.replaceChildren(...orders.map((order) => {
      const li = document.createElement('li');
      li.textContent = `#${order.id}: ${order.quantity} × ${order.name} = $${order.total.toFixed(2)}`;
      return li;
    }));
  } catch {
    orderList.replaceChildren();
  }
}

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const newOrder = { menuId: Number(orderItem.value), quantity: Number(orderQty.value) };

  orderButton.disabled = true;
  setStatus(orderStatus, 'loading', 'Sending your order…');

  try {
    const response = await fetch('api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),      // objects must be turned into a JSON string
    });
    const text = await response.text();    // read once as text, so we can show any answer
    orderOutput.textContent = `status ${response.status}\n${text}`;
    if (!response.ok) {
      // Our API sends { "error": "..." } on a 400. Live Server sends a 404/405 page.
      let reason = `HTTP ${response.status}`;
      try { reason = JSON.parse(text).error || reason; } catch { /* not JSON */ }
      throw new Error(reason);
    }
    const saved = JSON.parse(text);
    setStatus(orderStatus, 'success', `Order #${saved.id} placed: ${saved.quantity} × ${saved.name}.`);
    await loadOrders();
  } catch (error) {
    const hint = serverMode.dataset.mode === 'api' ? '' : ' (POST needs the demo server: run npm start)';
    setStatus(orderStatus, 'error', `${error.message}${hint}`);
  } finally {
    orderButton.disabled = false;
  }
});

// =====================================================================
// 7. Promise.all: parallel requests
// =====================================================================
const parallelStatus = document.querySelector('#parallel-status');

document.querySelector('#btn-one-by-one').addEventListener('click', async () => {
  setStatus(parallelStatus, 'loading', 'Loading one after another…');
  const start = performance.now();
  try {
    const menu = await getJSON('data/menu.json');
    const specials = await getJSON('data/specials.json');
    const hours = await getJSON('data/hours.json');
    const ms = Math.round(performance.now() - start);
    setStatus(parallelStatus, 'success',
      `${menu.length} items, ${specials.items.length} specials, open ${hours.open}-${hours.close}. Took ${ms} ms.`);
  } catch (error) {
    setStatus(parallelStatus, 'error', error.message);
  }
});

document.querySelector('#btn-all').addEventListener('click', async () => {
  setStatus(parallelStatus, 'loading', 'Loading all at once…');
  const start = performance.now();
  try {
    const [menu, specials, hours] = await Promise.all([
      getJSON('data/menu.json'),
      getJSON('data/specials.json'),
      getJSON('data/hours.json'),
    ]);
    const ms = Math.round(performance.now() - start);
    setStatus(parallelStatus, 'success',
      `${menu.length} items, ${specials.items.length} specials, open ${hours.open}-${hours.close}. Took ${ms} ms.`);
  } catch (error) {
    // If ANY one of the three fails, Promise.all rejects and we land here.
    setStatus(parallelStatus, 'error', error.message);
  }
});

// =====================================================================
// 8. Not just JSON: fetch Markdown with response.text(), render with markdown-it
// =====================================================================
const markdownStatus = document.querySelector('#markdown-status');
const markdownOutput = document.querySelector('#markdown-output');

document.querySelector('#btn-markdown').addEventListener('click', async () => {
  setStatus(markdownStatus, 'loading', 'Loading notes/about.md…');
  try {
    await maybeSlow();
    const response = await fetch('notes/about.md');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();          // text, not JSON

    try {
      // markdown-it from a CDN, loaded only when needed. (With npm: npm install markdown-it.)
      const { default: markdownit } = await import('https://cdn.jsdelivr.net/npm/markdown-it@14/+esm');
      const md = markdownit();                        // html: false by default, so raw HTML in the file is escaped
      markdownOutput.innerHTML = md.render(markdown); // the ONE place we use innerHTML: markdown-it made safe HTML
      setStatus(markdownStatus, 'success', 'Rendered with markdown-it.');
    } catch {
      // Offline or the CDN is blocked: still show the text.
      const pre = document.createElement('pre');
      pre.textContent = markdown;
      markdownOutput.replaceChildren(pre);
      setStatus(markdownStatus, 'empty', 'markdown-it did not load (offline?), so here is the raw text.');
    }
  } catch (error) {
    setStatus(markdownStatus, 'error', `Could not load the notes: ${error.message}`);
  }
});

// =====================================================================
// 9. Optional extra: a real public API with a query string (Open-Meteo, no key)
// =====================================================================
const weatherForm = document.querySelector('#weather-form');
const weatherStatus = document.querySelector('#weather-status');
const weatherButton = document.querySelector('#btn-weather');

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const select = document.querySelector('#weather-city');
  const [latitude, longitude] = select.value.split(',');
  const city = select.selectedOptions[0].textContent;

  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,wind_speed_10m',
    timezone: 'America/Edmonton',
  });

  weatherButton.disabled = true;
  setStatus(weatherStatus, 'loading', `Asking Open-Meteo about ${city}…`);
  try {
    const data = await getJSON(`https://api.open-meteo.com/v1/forecast?${params}`);
    const { temperature_2m: temp, wind_speed_10m: wind } = data.current;
    setStatus(weatherStatus, 'success', `${city}: ${temp} °C, wind ${wind} km/h.`);
  } catch (error) {
    setStatus(weatherStatus, 'error', `No weather right now (${error.message}). Are you online?`);
  } finally {
    weatherButton.disabled = false;
  }
});

// =====================================================================
// Start-up: which server are we on?
// =====================================================================
async function detectServer() {
  try {
    const response = await fetch('api/orders');
    if (!response.ok) throw new Error();
    serverMode.dataset.mode = 'api';
    serverMode.textContent = 'demo server with API (npm start). Everything works.';
    loadOrders();
  } catch {
    serverMode.dataset.mode = 'files';
    serverMode.textContent = 'files only (Live Server). Section 6 (POST) needs npm start.';
  }
}

fillOrderItems();
detectServer();

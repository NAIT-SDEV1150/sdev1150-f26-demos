// render.js: turns data into DOM. No fetch in this file.
// Each function takes data and makes the page match it.

const listEl = document.querySelector('#plant-list');
const cardTemplate = document.querySelector('#plant-card-template');
const detailEl = document.querySelector('#detail');
const detailTemplate = document.querySelector('#plant-detail-template');
const statusEl = document.querySelector('#status');
const retryBtn = document.querySelector('#retry');
const pageInfo = document.querySelector('#page-info');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const form = document.querySelector('#plant-form');
const formError = document.querySelector('#form-error');

const money = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
export const formatPrice = (price) => money.format(price);

// One plant -> one <li>, stamped from the <template>.
export function createPlantCard(plant, selectedId) {
  const fragment = cardTemplate.content.cloneNode(true);
  const card = fragment.querySelector('.plant-card');

  card.dataset.id = plant.id; // so a click can find out which plant it was
  card.querySelector('.plant-name').textContent = plant.name;
  card.querySelector('.plant-meta').textContent =
    `${plant.category} · ${formatPrice(plant.price)} · ${plant.stock > 0 ? `${plant.stock} in stock` : 'sold out'}`;

  const fav = card.querySelector('.plant-fav');
  fav.textContent = plant.favourite ? '★' : '☆';
  fav.setAttribute('aria-pressed', String(plant.favourite));

  card.classList.toggle('selected', plant.id === selectedId);
  card.classList.toggle('sold-out', plant.stock === 0);
  return card;
}

// The whole list. replaceChildren() clears the old cards first: no duplicates.
export function renderPlantList(plants, selectedId) {
  listEl.replaceChildren(...plants.map((plant) => createPlantCard(plant, selectedId)));
}

// loading | error | empty | ready: the screen must always tell the truth.
export function renderStatus({ status, error, total, q, category }) {
  statusEl.className = `status ${status}`;
  retryBtn.hidden = status !== 'error';
  listEl.setAttribute('aria-busy', String(status === 'loading'));

  if (status === 'loading') {
    statusEl.textContent = 'Loading plants…';
  } else if (status === 'error') {
    statusEl.textContent = `Couldn't load plants: ${error.message}`;
  } else if (total === 0) {
    const filters = [q && `"${q}"`, category].filter(Boolean).join(' in ');
    statusEl.textContent = filters ? `No plants match ${filters}.` : 'No plants yet. Add the first one!';
  } else {
    statusEl.textContent = `${total} plant${total === 1 ? '' : 's'} found.`;
  }
}

// A one-off message in the status line (for example, a failed favourite).
export function renderMessage(text, kind = 'ready') {
  statusEl.className = `status ${kind}`;
  statusEl.textContent = text;
}

export function renderPager({ page, pages, status }) {
  pageInfo.textContent = `Page ${page} of ${pages}`;
  prevBtn.disabled = status === 'loading' || page <= 1;
  nextBtn.disabled = status === 'loading' || page >= pages;
}

// The detail panel shows: a hint, a loading line, an error, or one plant.
export function renderDetail({ plant, loading, error }) {
  if (loading) {
    detailEl.replaceChildren(paragraph('Loading details…', 'muted'));
    return;
  }
  if (error) {
    detailEl.replaceChildren(paragraph(error.message, 'error'));
    return;
  }
  if (!plant) {
    detailEl.replaceChildren(paragraph('Pick a plant to see its details.', 'muted'));
    return;
  }
  const fragment = detailTemplate.content.cloneNode(true);
  const article = fragment.querySelector('.plant-detail');
  article.dataset.id = plant.id;
  article.querySelector('.detail-name').textContent = plant.name;
  article.querySelector('.detail-category').textContent = plant.category;
  article.querySelector('.detail-price').textContent = formatPrice(plant.price);
  article.querySelector('.detail-stock').textContent = plant.stock > 0 ? plant.stock : 'Sold out';
  article.querySelector('.detail-notes').textContent = plant.notes || 'No notes.';
  detailEl.replaceChildren(article);
}

export function renderCategoryOptions(select, categories) {
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.label;
    select.append(option);
  }
}

// ----- the form -----

export function showForm(plant) {
  form.hidden = false;
  detailEl.hidden = true;
  form.querySelector('#form-title').textContent = plant ? `Edit ${plant.name}` : 'New plant';
  form.elements.name.value = plant?.name ?? '';
  form.elements.category.value = plant?.category ?? '';
  form.elements.price.value = plant?.price ?? '';
  form.elements.stock.value = plant?.stock ?? '';
  form.elements.notes.value = plant?.notes ?? '';
  clearFieldErrors();
  form.elements.name.focus();
}

export function hideForm() {
  form.hidden = true;
  detailEl.hidden = false;
  clearFieldErrors();
}

export function setFormBusy(busy) {
  form.querySelector('#save').disabled = busy;
  form.querySelector('#save').textContent = busy ? 'Saving…' : 'Save';
}

// The server answers 400 with { error, fields: { price: 'price must be a number' } }.
export function showFieldErrors(fields = {}, message = '') {
  clearFieldErrors();
  for (const [field, text] of Object.entries(fields)) {
    const slot = form.querySelector(`[data-error-for="${field}"]`);
    if (slot) slot.textContent = text;
    form.elements[field]?.classList.add('invalid');
  }
  formError.textContent = message;
}

export function clearFieldErrors() {
  form.querySelectorAll('.field-error').forEach((slot) => { slot.textContent = ''; });
  form.querySelectorAll('.invalid').forEach((input) => input.classList.remove('invalid'));
  formError.textContent = '';
}

function paragraph(text, className) {
  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  return p;
}

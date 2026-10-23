// Demo 9: build cards from a <template>, one function, used many times.
const template = document.querySelector('#card-template');
const cards = document.querySelector('#cards');

// Build one card and give it back (return). It is not on the page yet.
function buildCard(title, detail) {
  const card = document.createElement('div');          // 1. the outer box
  card.classList.add('card');
  card.append(template.content.cloneNode(true));       // 2. copy the stamp inside it
  card.querySelector('.card-title').textContent = title;    // 3. fill it in
  card.querySelector('.card-detail').textContent = detail;
  card.querySelector('.remove').addEventListener('click', () => card.remove()); // 4. wire the button
  return card;                                         // 5. hand it back
}

// Start with a few cards from an array
const starter = [
  { title: 'querySelector', detail: 'Finds the first match.' },
  { title: 'preventDefault', detail: 'Stops the page reload.' },
  { title: 'cloneNode(true)', detail: 'Copies an element and everything inside it.' },
];
starter.forEach((item) => cards.append(buildCard(item.title, item.detail)));

// Add more from the form
const form = document.querySelector('#card-form');
const titleInput = document.querySelector('#title');
const detailInput = document.querySelector('#detail');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const detail = detailInput.value.trim();
  if (title === '' || detail === '') return;
  cards.append(buildCard(title, detail));
  form.reset();
  titleInput.focus();
});

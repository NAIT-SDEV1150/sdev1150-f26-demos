// Demo 7: the main input events. Every handler writes a line to the log.
const log = document.querySelector('#log');
function show(message) {
  const line = document.createElement('div');
  line.textContent = message;
  log.prepend(line);                       // newest at the top
}

const nameInput = document.querySelector('#name');
const preview = document.querySelector('#preview');

// input: fires on EVERY keystroke (and paste, delete...)
nameInput.addEventListener('input', (event) => {
  preview.textContent = event.target.value;           // what is in the box right now
  show(`input → value is "${event.target.value}"`);
});

nameInput.addEventListener('keydown', (event) => {
  alert(event.key);           // what was pressed
});

// focus / blur: when the box gains or loses the cursor
nameInput.addEventListener('focus', () => {
  nameInput.classList.add('focused');
  show('focus → cursor entered the box');
});
nameInput.addEventListener('blur', () => {
  nameInput.classList.remove('focused');
  show(`blur → left the box (final value "${nameInput.value.trim()}")`);
});



// change: fires when the choice is finished (select, checkbox)
document.querySelector('#colour').addEventListener('change', (event) => {
  show(`change → colour is ${event.target.value || '(none)'}`);
  document.body.style.background = event.target.value ? `light${event.target.value}` : '';
});

document.querySelector('#agree').addEventListener('change', (event) => {
  show(`change → checked is ${event.target.checked}`);
});

// keydown: which key was pressed
document.querySelector('#search').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    show(`keydown Enter → search for "${event.target.value.trim()}"`);
  } else {
    show(`keydown → ${event.key}`);
  }
});

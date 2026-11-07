// To-do list: full CRUD. The array is the truth; the page is drawn from it.

// ---------- Elements ----------
const form = document.querySelector('#todo-form');
const textInput = document.querySelector('#todo-text');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const template = document.querySelector('#todo-template');

// ---------- State: an array of plain objects ----------
let todos = [
  { id: 1, text: 'Finish the flashcard demo', done: true },
  { id: 2, text: 'Read about setCustomValidity', done: false },
  { id: 3, text: 'Push AA02', done: false },
];
let nextId = 4;

// ---------- C, U, D: change the array, then render ----------
function createTodo(text) {
  todos.push({ id: nextId++, text, done: false });
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  todo.done = !todo.done;
  render();
}

function updateTodoText(id, newText) {
  const todo = todos.find((t) => t.id === id);
  todo.text = newText;
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  render();
}

// ---------- The reusable component: one item from the template ----------
function buildTodoItem(todo) {
  const li = template.content.cloneNode(true).querySelector('li');
  li.dataset.id = todo.id;                         // remember which object this is
  li.querySelector('.text').textContent = todo.text;
  li.querySelector('.toggle').checked = todo.done;
  li.classList.toggle('done', todo.done);
  return li;
}

// ---------- R: draw the whole list from the array ----------
function render() {
  list.replaceChildren();                 // 1. empty the list
  todos.forEach((todo) => {               // 2. for each object in the array...
    list.append(buildTodoItem(todo));     //    ...build its <li> and add it
  });
  const left = todos.filter((t) => !t.done).length;
  count.textContent = `${left} of ${todos.length} left to do`;
}

// ---------- Events ----------
// Create
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = textInput.value.trim();
  if (text === '') return;
  createTodo(text);
  form.reset();
  textInput.focus();
});

// One listener for every item's buttons (event delegation)
list.addEventListener('click', (event) => {
  const li = event.target.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (event.target.matches('.delete')) deleteTodo(id);
  if (event.target.matches('.edit')) startEditing(li);
});

// Update: tick the box
list.addEventListener('change', (event) => {
  if (event.target.matches('.toggle')) {
    toggleTodo(Number(event.target.closest('li').dataset.id));
  }
});

// Update: edit the text in place
function startEditing(li) {
  const field = li.querySelector('.edit-field');
  li.classList.add('editing');
  field.hidden = false;
  field.value = li.querySelector('.text').textContent;
  field.focus();
}

list.addEventListener('keydown', (event) => {
  if (!event.target.matches('.edit-field')) return;
  const li = event.target.closest('li');
  if (event.key === 'Enter') {
    const newText = event.target.value.trim();
    if (newText) updateTodoText(Number(li.dataset.id), newText);
    else render();                                  // empty: cancel
  }
  if (event.key === 'Escape') render();             // cancel: redraw from the array
});

render();

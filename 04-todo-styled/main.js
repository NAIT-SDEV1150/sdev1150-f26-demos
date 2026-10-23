// Day 14, demo 3: a to-do list. Add an item, check it off, delete it.
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');

// The error box is the element right after the input in the HTML:
//   <input id="todo-input">
//   <div class="error-message"></div>   ← input.nextElementSibling
const errorBox = input.nextElementSibling;

// --- Checking the input -------------------------------------------
// Returns an error message, or '' (empty string) when the text is OK.
function checkItem(text) {
  if (text === '') {
    return 'Please type a to-do item.';
  }
  if (!/^[A-Za-z]/.test(text)) {          // first character must be a letter
    return 'The item must start with a letter.';
  }
  if (text.length < 3) {
    return 'The item must be at least 3 characters long.';
  }
  return '';
}

function showError(message) {
  errorBox.textContent = message;               // '' clears the message
  input.classList.toggle('invalid', message !== '');
}

// Check on every keystroke, so the message updates as you type
input.addEventListener('input', () => {
  showError(checkItem(input.value.trim()));
});

// --- Building one item ---------------------------------------------
function buildItem(text) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);   // cross it off
  });

  const span = document.createElement('span');
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', `Delete ${text}`);
  deleteBtn.addEventListener('click', () => {
    li.remove();                                     // delete THIS item
  });

  li.append(checkbox, span, deleteBtn);
  return li;
}

// --- Submitting the form -------------------------------------------
form.addEventListener('submit', (event) => {
  event.preventDefault();               // stop the page from reloading
  const text = input.value.trim();
  const message = checkItem(text);
  showError(message);
  if (message !== '') return;           // don't add a bad item

  list.append(buildItem(text));
  input.value = '';                     // clear the box
  input.focus();                        // ready for the next item
});

input.focus();

// Bug Hunt: Reading List
// This file has bugs in it ON PURPOSE. Don't read it top to bottom looking for them:
// run the page, watch what goes wrong, and let DevTools point you at the line.

const form = document.querySelector('#book-form');
const titleInput = document.querySelector('#title');
const pagesInput = document.querySelector('#pages');
const list = document.querySelector('#book-list');
const summary = document.querySelector('#summary');
const unreadOnly = document.querySelector('#unread-only');
const saveBtn = document.querySelector('#save-btn');
const clearBtn = document.querySelector('#clear-btn');
const message = document.querySelector('#form-message');

// Load any saved books (an array of { title, pages, read })
const saved = localStorage.getItem('reading-list');
let books = saved ? JSON.parse(saved) : [];

function totalPages(bookArray) {
  let total = 0;
  bookArray.forEach((book) => {
    total = total + book.pages;
  });
  return total;
}

function render() {
  list.replaceChildren();

  const visible = unreadOnly.checked
    ? books.filter((book) => book.read = false)
    : books;

  visible.foreach((book) => {
    const item = document.createElement('li');
    item.classList.add('book');
    if (book.read) {
      item.classList.add('is-read');
    }

    const name = document.createElement('span');
    name.textContent = `${book.title} (${book.pages} pages)`;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = book.read ? 'Mark unread' : 'Mark read';
    button.addEventListener('click', () => {
      book.read = !book.read;
      render();
    });

    item.append(name, button);
    list.append(item);
  });

  summary.textContent = `${books.length} books · ${totalPages(books)} pages`;
}

form.addEventListener('submit', () => {
  const title = titleInput.value.trim();
  books.push({ title, pages: pagesInput.value, read: false });
  message.textContent = `Added "${title}".`;
  form.reset();
  render();
});

unreadOnly.addEventListener('change', render);

saveBtn.addEventListener('click', () => {
  localStorage.setItem('reading-list', books);
  message.textContent = 'Saved.';
});

clearBtn.addEventListener('click', () => {
  books = [];
  localStorage.removeItem('reading-list');
  message.textContent = 'List cleared.';
  render();
});

render();

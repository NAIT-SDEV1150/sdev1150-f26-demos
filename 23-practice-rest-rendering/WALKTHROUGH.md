# Practice 23: walkthrough and answers

Try each question on your own first. Then come here to check.

Every answer below was tested in a real browser (Microsoft Edge) against this folder's `index.html` and the practice API with fresh data. You can paste them all into one `main.js`, one after the other, in order. A few later answers reuse helpers from earlier ones (`getJson` from Q6, `api` from Q11, `renderTitles` from Q12), and that's on purpose: real code reuses its helpers.

Each question has the same parts:
- **Look at the HTML:** what the page gives you to work with
- **Answer:** the code
- **Step by step:** what each line does, and why this method
- **What you'll see:** on the page and in DevTools
- **Common mistake**

Keep **DevTools → Network** open (filter: **Fetch/XHR**). For every request you can click it and read: **Headers** (the URL, method and status), **Payload** (what you sent) and **Response** (what came back). That is where most bugs show themselves.

---

## Tier 1: Simple

### Q1. Status code

**Look at the HTML:** `<output id="q1-output">?</output>` is an empty slot for one value.

```js
const BASE_URL = 'http://localhost:3000/api';

// Q1
async function q1() {
  const response = await fetch(`${BASE_URL}/books`);
  document.querySelector('#q1-output').textContent = response.status;
}
q1();
```

**Step by step**
1. `BASE_URL` keeps the start of every API address in one place. If the port ever changes, you change one line.
2. `async function` lets you use `await` inside it.
3. `fetch(...)` sends a GET request. It returns a **promise** of a `Response`. `await` pauses this function until the response arrives.
4. `response.status` is the HTTP status code as a number. `200` means OK.
5. `q1();` actually runs the function. A function that is never called does nothing.

**What you'll see:** `200` on the page; in Network, one `books` request with status 200.

**Common mistake:** forgetting `await`. Then `response` is a Promise, not a Response, and `response.status` is `undefined`.

### Q2. How many books?

**Look at the HTML:** `#q2-output` wants text like `14 books`.

```js
// Q2
async function q2() {
  const response = await fetch(`${BASE_URL}/books`);
  const data = await response.json();
  document.querySelector('#q2-output').textContent = `${data.total} books`;
}
q2();
```

**Step by step**
1. Fetch the list, as in Q1.
2. `response.json()` reads the body and turns the JSON text into a JavaScript object. It **also** returns a promise, so it needs its own `await`.
3. This API wraps lists in an object: `{ items, total, page, limit, pages }`. The count is `data.total`.
4. A template literal builds `14 books`.

**What you'll see:** `14 books`. In Network → Preview you can expand the object and see `items` and `total`.

**Common mistake:** writing `data.length`. `data` is an object, not an array, so `data.length` is `undefined`. Always check the shape in Preview or in the API docs first. (Some APIs return a bare array. This one doesn't.)

### Q3. Build a query string

**Look at the HTML:** `<code id="q3-output">`: a place to show text.

```js
// Q3
const params = new URLSearchParams({ genre: 'mystery', _page: 1, _limit: 2 });
document.querySelector('#q3-output').textContent = params.toString();
```

**Step by step**
1. `new URLSearchParams({...})` takes an object and turns each key and value into `key=value` pairs.
2. `.toString()` joins them with `&`. Numbers become text automatically.

**What you'll see:** `genre=mystery&_page=1&_limit=2`. You'd add it to a URL after a `?`: `` `${BASE_URL}/books?${params}` ``.

**Why it works:** `URLSearchParams` also **encodes** special characters for you. A search for `rock & roll` becomes `q=rock+%26+roll`, so the `&` doesn't break the URL.

**Common mistake:** building the string by hand: `'?genre=' + genre + '&page=' + page`. It works until someone types a space, `&` or `#`.

### Q4. Object to JSON text

**Look at the HTML:** `<code id="q4-output">`.

```js
// Q4
const newBook = { title: 'Dune', year: 1965 };
document.querySelector('#q4-output').textContent = JSON.stringify(newBook);
```

**Step by step**
1. `newBook` is a JavaScript object (it lives in memory).
2. `JSON.stringify` turns it into **text** in JSON format: `{"title":"Dune","year":1965}`. Note the double quotes around the keys.

**What you'll see:** `{"title":"Dune","year":1965}`.

**Why it matters:** HTTP can only send text. Every `POST`, `PUT` and `PATCH` body must go through `JSON.stringify` first. The reverse is `JSON.parse` (and `response.json()` does that for you).

**Common mistake:** showing the object itself: `textContent = newBook` shows `[object Object]`. That is also exactly what the server receives if you forget `JSON.stringify` on a request body.

### Q5. A book that doesn't exist

**Look at the HTML:** `#q5-output`.

```js
// Q5
async function q5() {
  const response = await fetch(`${BASE_URL}/books/999`);
  document.querySelector('#q5-output').textContent = `ok: ${response.ok}, status: ${response.status}`;
}
q5();
```

**Step by step**
1. Ask for `/books/999`. The server answers `404 Not Found`.
2. `response.ok` is `true` for statuses 200-299 and `false` for everything else.
3. Show both values.

**What you'll see:** `ok: false, status: 404`, and a red 404 line in Network. There is **no** error in the Console from your code.

**Why it matters:** this is the most important fact about fetch. **fetch does not throw for 404 or 500.** It only throws when there is no answer at all (server stopped, wrong port, CORS block). An error status is still an answer, so you must check `response.ok` yourself.

**Common mistake:** wrapping fetch in `try/catch` and expecting the `catch` to run for a 404. It won't.

---

## Tier 2: Easy

### Q6. A small getJson helper

**Look at the HTML:** `#q6-output` will hold one title.

```js
// Q6
async function getJson(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function q6() {
  const output = document.querySelector('#q6-output');
  try {
    const book = await getJson('/books/5');
    output.textContent = book.title;
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  }
}
q6();
```

**Step by step**
1. `getJson(path)` puts the base URL and the path together, so callers only write `/books/5`.
2. `if (!response.ok) throw ...` turns an HTTP error status into a real JavaScript error. Now `try/catch` **does** work for 404s.
3. `return response.json()` hands back the parsed data. (Returning a promise from an `async` function is fine: the caller's `await` waits for it.)
4. In `q6`, `await getJson('/books/5')` gives one book object; `book.title` is its title.
5. The `catch` shows a message if anything went wrong.

**What you'll see:** `The Hound of the Baskervilles`. Change the id to `999` and you'll see `Error: 404 Not Found`.

**Common mistake:** putting the `response.ok` check **after** `response.json()` and then using the data anyway. The 404 body `{ error: "..." }` gets treated as a book, and the page shows `undefined`.

### Q7. Render a list with createElement

**Look at the HTML:** an empty `<ul id="q7-list">`.

```js
// Q7
async function q7() {
  const list = document.querySelector('#q7-list');
  const data = await getJson('/books?_sort=title&_page=1&_limit=5');
  list.textContent = '';
  data.items.forEach((book) => {
    const li = document.createElement('li');
    li.textContent = book.title;
    list.append(li);
  });
}
q7();
```

**Step by step**
1. The query string asks the **server** to sort by title and send only page 1, five per page.
2. `list.textContent = ''` clears anything already there, so running it twice doesn't duplicate rows.
3. For each book in `data.items`: make an `<li>`, put the title in with `textContent`, and add it to the list.

**What you'll see:** Alice's Adventures in Wonderland, Anne of Green Gables, Frankenstein, Moby-Dick, On the Origin of Species.

**Why `textContent`:** data from a server is "untrusted": anybody could have typed it. `textContent` always shows it as plain text, so a title like `<img onerror=...>` can't run code.

**Common mistake:** `data.forEach(...)`. The array is `data.items`. The error is `data.forEach is not a function`.

### Q8. Render a list with a template

**Look at the HTML:** `<template id="book-template">` holds one `<li class="book">` with three empty spots: `.book-title`, `.book-author`, `.book-year`. A template is never shown; it's a stamp.

```js
// Q8
function createBookItem(book) {
  const template = document.querySelector('#book-template');
  const fragment = template.content.cloneNode(true);
  fragment.querySelector('.book-title').textContent = book.title;
  fragment.querySelector('.book-author').textContent = book.author;
  fragment.querySelector('.book-year').textContent = book.year;
  return fragment;
}

async function q8() {
  const list = document.querySelector('#q8-list');
  const data = await getJson('/books?genre=mystery');
  list.replaceChildren(...data.items.map(createBookItem));
}
q8();
```

**Step by step**
1. `createBookItem(book)` makes **one** item. `template.content.cloneNode(true)` copies the stamp, including everything inside it (`true` = deep copy).
2. `fragment.querySelector(...)` searches **inside the copy only**, then fills each spot.
3. `?genre=mystery` asks the server to filter.
4. `data.items.map(createBookItem)` turns the array of books into an array of DOM pieces.
5. `list.replaceChildren(...pieces)` removes the old children and adds all the new ones in one step. The `...` spreads the array into separate arguments.

**What you'll see:** three lines like **The Hound of the Baskervilles** by Arthur Conan Doyle (1902).

**Common mistake:** `document.querySelector('.book-title')` inside the function. That finds the first `.book-title` on the **page**, not in your copy, so every book overwrites the same line (or finds nothing).

### Q9. A loading message

**Look at the HTML:** `<p id="q9-status" class="status">`. The `.loading` and `.error` helper classes are in `styles.css`.

```js
// Q9
async function q9() {
  const status = document.querySelector('#q9-status');
  status.textContent = 'Loading…';
  status.classList.add('loading');
  try {
    const data = await getJson('/books?_delay=800');
    status.textContent = `Loaded ${data.total} books.`;
  } catch (error) {
    status.textContent = `Couldn't load books: ${error.message}`;
    status.classList.add('error');
  } finally {
    status.classList.remove('loading');
  }
}
q9();
```

**Step by step**
1. Show `Loading…` **before** the request. The user sees something is happening.
2. `_delay=800` makes this API wait 0.8 s, like a slow network.
3. On success, replace the text with the result.
4. On failure, show a calm error message (and the `.error` colour).
5. `finally` runs either way: the loading style always comes off.

**What you'll see:** `Loading…` (grey, italic) for almost a second, then `Loaded 14 books.` In Network, the request's **Time** column shows about 800 ms. Stop the server and reload to see the error branch.

**Common mistake:** setting the loading text **after** the `await`. By then the data is already here, so the message flashes for zero seconds (or is never seen).

### Q10. An empty state

**Look at the HTML:** an empty `<ul id="q10-list">`. The `.empty` class styles a "nothing here" line.

```js
// Q10
async function q10() {
  const list = document.querySelector('#q10-list');
  const term = 'dragon';
  const data = await getJson(`/books?q=${encodeURIComponent(term)}`);
  list.textContent = '';
  if (data.items.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = `No books match "${term}".`;
    list.append(li);
    return;
  }
  data.items.forEach((book) => {
    const li = document.createElement('li');
    li.textContent = book.title;
    list.append(li);
  });
}
q10();
```

**Step by step**
1. `encodeURIComponent` makes the search text safe inside a URL (same job as `URLSearchParams`).
2. An empty search result is **not** an error: the status is `200` and `items` is `[]`.
3. If there are no items, show one friendly `<li class="empty">` and stop with `return`.
4. Otherwise, render the titles as usual.

**What you'll see:** *No books match "dragon".* Change the term to `wells` and you'll see two titles.

**Common mistake:** showing nothing at all. A blank list looks broken: the user can't tell "no results" from "still loading" from "it crashed". Every list needs a loading, an error and an empty state.

---

## Tier 3: Competent

### Q11. The api(path, options) helper

**Look at the HTML:** `#q11-output` for one line of text.

```js
// Q11
async function api(path, options = {}) {
  const { body, headers = {}, ...rest } = options;
  const init = { ...rest, headers: { ...headers } };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${path}`, init);
  const text = await response.text();          // empty for 204 No Content
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.error ?? response.statusText);
    error.status = response.status;
    error.body = data;
    throw error;
  }
  return data;
}

async function q11() {
  const output = document.querySelector('#q11-output');
  const book = await api('/books/1');
  try {
    await api('/books/999');
    output.textContent = `Book 1: ${book.title} · no error?`;
  } catch (error) {
    output.textContent = `Book 1: ${book.title} · ${error.status}: ${error.message}`;
  }
}
q11();
```

**Step by step**
1. `const { body, headers = {}, ...rest } = options;` pulls `body` and `headers` out of the options. Everything else (like `method`) stays in `rest`.
2. If there is a body, the helper does the two jobs people forget: `JSON.stringify` it and add `Content-Type: application/json`. Now callers just write `{ method: 'POST', body: book }`.
3. `response.text()` reads the body as text. If it's empty (a `204` from DELETE), `data` is `null`. Calling `response.json()` on an empty body would throw *Unexpected end of JSON input*.
4. If the status isn't OK, make an Error with the **server's own message** (`data.error`). `?.` means "if `data` is null, don't crash, just give `undefined`"; `??` then falls back to the status text.
5. Save `status` and `body` on the error, so the caller can react: a `404` is different from a `400` with field messages.
6. In `q11`, the first call works; the second throws, and the `catch` shows the status and message.

**What you'll see:** `Book 1: Pride and Prejudice · 404: books 999 not found`.

**Why one helper:** every request now gets the same JSON handling and the same error handling. A bug fixed here is fixed everywhere. This is the pattern in demo 22's `api.js`.

**Common mistake:** setting `Content-Type` but forgetting `JSON.stringify` (the server gets `[object Object]` and answers `400 Body is not valid JSON`), or the other way round (the server answers `415`).

### Q12. Search form

**Look at the HTML:** `#q12-form` with `#q12-search` and a submit button, plus `#q12-status` and `#q12-list`.

```js
// Q12
function renderTitles(list, books) {
  list.replaceChildren(...books.map((book) => {
    const li = document.createElement('li');
    li.textContent = `${book.title} (${book.author})`;
    return li;
  }));
}

document.querySelector('#q12-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const term = document.querySelector('#q12-search').value.trim();
  const status = document.querySelector('#q12-status');
  const list = document.querySelector('#q12-list');
  const params = new URLSearchParams({ q: term });
  status.textContent = 'Searching…';
  try {
    const data = await api(`/books?${params}`);
    renderTitles(list, data.items);
    status.textContent = data.total === 0
      ? `No results for "${term}".`
      : `${data.total} result${data.total === 1 ? '' : 's'}`;
  } catch (error) {
    list.textContent = '';
    status.textContent = `Search failed: ${error.message}`;
  }
});
```

**Step by step**
1. `renderTitles` is a small render function we'll reuse in later questions: data in, list items out.
2. Listen for `submit` on the **form** (it fires for the button and for Enter). `preventDefault()` stops the page reload.
3. Read and trim the search text, then let `URLSearchParams` encode it.
4. Show `Searching…`, fetch, render, then set the status from `data.total`.
5. The ternary picks `result` or `results`.

**What you'll see:** search `wells` → `2 results` and two H. G. Wells books. Search `zzz` → `No results for "zzz".` and an empty list. In Network, look at the request URL: `books?q=wells`.

**Common mistake:** listening for `click` on the button. Pressing Enter in the box then reloads the page and your results vanish.

### Q13. Master / detail

**Look at the HTML:** `#q13-list` (a list for buttons) and `#q13-detail` (the detail panel), side by side.

```js
// Q13
async function q13() {
  const list = document.querySelector('#q13-list');
  const detail = document.querySelector('#q13-detail');
  const data = await api('/books?_sort=year&_limit=5');

  list.replaceChildren(...data.items.map((book) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.id = book.id;
    button.textContent = book.title;
    li.append(button);
    return li;
  }));

  list.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    list.querySelectorAll('.selected').forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    detail.textContent = 'Loading…';
    try {
      const book = await api(`/books/${button.dataset.id}`);
      const heading = document.createElement('h3');
      heading.textContent = book.title;
      const info = document.createElement('p');
      info.textContent = `${book.author}, ${book.year} · ${book.genre}`;
      detail.replaceChildren(heading, info);
    } catch (error) {
      detail.textContent = `Couldn't load that book: ${error.message}`;
    }
  });
}
q13();
```

**Step by step**
1. **Master:** fetch a short list and render one button per book. `button.dataset.id = book.id` writes `data-id="2"` into the HTML. That's how a click will know which book it was.
2. **One listener on the list** (event delegation) instead of one per button. `event.target.closest('button[data-id]')` finds the button even if you clicked on its text.
3. Move the `selected` class to the clicked button.
4. **Detail:** fetch `/books/<id>`, the "detail" endpoint, and build the panel.

**What you'll see:** five old classics; click Frankenstein → **Frankenstein** / *Mary Shelley, 1818 · sci-fi*. Each click shows a new `books/2` style request in Network.

**Why fetch the detail?** Real list endpoints often send a short version of each item; the detail endpoint sends everything, and it's fresh (someone may have edited it since the list loaded).

**Common mistake:** storing the array **index** instead of the id (`data-id="1"` for the second item). After sorting, filtering or deleting, index 1 is a different book. Ids never change.

### Q14. Create a book (POST)

**Look at the HTML:** `#q14-form` has inputs named `title`, `author`, `year` and a `genre` select. `novalidate` turns off the browser's pop-ups so you can see the **server's** answer.

```js
// Q14
document.querySelector('#q14-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  const status = document.querySelector('#q14-status');
  const book = {
    title: form.elements.title.value.trim(),
    author: form.elements.author.value.trim(),
    year: Number(form.elements.year.value),
    genre: form.elements.genre.value,
  };
  try {
    const created = await api('/books', { method: 'POST', body: book });
    status.className = 'status ok';
    status.textContent = `Created book #${created.id}: ${created.title}`;
    form.reset();
  } catch (error) {
    status.className = 'status error';
    status.textContent = `Could not save: ${error.message}`;
  }
});
```

**Step by step**
1. `form.elements.title` finds the input by its `name`.
2. Build a plain object. `Number(...)` turns the year text into a number, because the API's rule is "year must be a number".
3. `api('/books', { method: 'POST', body: book })`: the helper stringifies and sets the header.
4. The server answers `201 Created` with the **new** book, including the `id` it chose. Show what the server sent, not what you typed.
5. `form.reset()` clears the form for the next one.

**What you'll see:** submit empty → `Could not save: Validation failed`. Fill it in → `Created book #15: ...`. In Network, click the `books` POST: **Payload** shows your JSON, **Response** shows the new book.

**Common mistake:** sending `year: form.elements.year.value` (a string). The server answers `400` with `year must be a number (got "2024")`.

### Q15. Delete, then re-render

**Look at the HTML:** `#q15-list` and `#q15-status`.

```js
// Q15
async function loadQ15() {
  const list = document.querySelector('#q15-list');
  const data = await api('/books?_sort=id&_order=desc&_limit=3');
  list.replaceChildren(...data.items.map((book) => {
    const li = document.createElement('li');
    li.dataset.id = book.id;
    const title = document.createElement('span');
    title.textContent = `${book.title} `;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'delete';
    button.textContent = 'Delete';
    li.append(title, button);
    return li;
  }));
}

document.querySelector('#q15-list').addEventListener('click', async (event) => {
  const button = event.target.closest('.delete');
  if (!button) return;
  const li = button.closest('li');
  const title = li.querySelector('span').textContent.trim();
  const status = document.querySelector('#q15-status');
  button.disabled = true;
  try {
    await api(`/books/${li.dataset.id}`, { method: 'DELETE' });
    status.textContent = `Deleted ${title}.`;
    await loadQ15();
  } catch (error) {
    status.textContent = `Delete failed: ${error.message}`;
    button.disabled = false;
  }
});
loadQ15();
```

**Step by step**
1. `loadQ15` fetches the 3 newest (`_sort=id&_order=desc`) and renders them. Each `<li>` carries its book's id.
2. The click listener is added **once**, on the list, outside `loadQ15`. (If you added it inside, every reload would add another listener, and one click would delete several times.)
3. Disable the button so a double-click can't send two deletes.
4. `await` the DELETE. The server answers `204 No Content`; our `api` helper copes with the empty body.
5. Only **after** success: show the message and reload from the server. That's **confirm-then-update**: the screen never shows something the server hasn't agreed to.

**What you'll see:** the top book disappears and the next-newest one moves into the list. In Network: a `DELETE` with status 204, then a fresh `GET`.

**Common mistake:** `li.remove()` before (or without) waiting for the server. If the delete fails, the page lies: the book is gone from the screen but still in the database. Reload and it's back.

---

## Tier 4: Advanced

### Q16. Pagination

**Look at the HTML:** `#q16-list`, `#q16-prev`, `#q16-info`, `#q16-next`.

```js
// Q16
let q16Page = 1;
async function loadQ16() {
  const list = document.querySelector('#q16-list');
  const prev = document.querySelector('#q16-prev');
  const next = document.querySelector('#q16-next');
  prev.disabled = true;
  next.disabled = true;
  const data = await api(`/books?_sort=title&_limit=4&_page=${q16Page}`);
  renderTitles(list, data.items);
  document.querySelector('#q16-info').textContent = `Page ${data.page} of ${data.pages}`;
  prev.disabled = data.page <= 1;
  next.disabled = data.page >= data.pages;
}
document.querySelector('#q16-prev').addEventListener('click', () => { q16Page -= 1; loadQ16(); });
document.querySelector('#q16-next').addEventListener('click', () => { q16Page += 1; loadQ16(); });
loadQ16();
```

**Step by step**
1. `q16Page` is the **state**: which page we want.
2. Disable both buttons while loading, so fast clicks can't skip pages.
3. Ask the server for one page. It sends back `page` and `pages`, so you never have to work out the page count yourself.
4. Render, then set each button from the server's numbers.

**What you'll see:** `Page 1 of 4` (14 books ÷ 4 per page = 3.5, rounded up). Previous is disabled; Next works until page 4.

**Why the server pages:** a real API might have 100,000 books. Sending them all and slicing in the browser would be slow. `_page` and `_limit` make the server send only what you show.

**Common mistake:** working out `pages` from `items.length`. On page 1, `items.length` is 4, which tells you nothing about the total. Use `total` or `pages` from the response.

### Q17. Optimistic "read" checkboxes

**Look at the HTML:** `#q17-fail` (a checkbox that makes failures happen), `#q17-list`, `#q17-status`.

```js
// Q17
async function q17() {
  const list = document.querySelector('#q17-list');
  const data = await api('/books?_sort=id&_limit=5');
  list.replaceChildren(...data.items.map((book) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = book.read;
    box.dataset.id = book.id;
    label.append(box, ` ${book.title}`);
    li.append(label);
    return li;
  }));

  list.addEventListener('change', async (event) => {
    const box = event.target;
    if (!box.matches('input[type="checkbox"]')) return;
    const status = document.querySelector('#q17-status');
    const title = box.parentElement.textContent.trim();
    const headers = document.querySelector('#q17-fail').checked ? { 'X-Simulate-Error': '500' } : {};
    // The checkbox already shows the new value: that IS the optimistic update.
    try {
      await api(`/books/${box.dataset.id}`, { method: 'PATCH', body: { read: box.checked }, headers });
      status.className = 'status ok';
      status.textContent = `Saved "${title}".`;
    } catch (error) {
      box.checked = !box.checked; // roll back
      status.className = 'status error';
      status.textContent = `Couldn't save "${title}": ${error.message}`;
    }
  });
}
q17();
```

**Step by step**
1. Render one checkbox per book, ticked when `read` is `true`. `label.append(box, text)` puts the box and the title in one label, so clicking the title ticks the box.
2. One `change` listener on the list (delegation again).
3. **Optimistic:** the browser has already ticked the box, so the screen is updated before the server even hears about it.
4. Send a `PATCH` with only the field that changed.
5. If it fails, **roll back**: flip the box back and explain.

**What you'll see:** ticks respond instantly and `Saved "..."` appears. Tick `#q17-fail` and try again: the box flips, then flips back with `Couldn't save "...": Simulated 500 error...`.

**When to be optimistic:** small, frequent, easy-to-undo changes that almost always succeed (likes, stars, checkboxes). For big or permanent things (delete, pay, send), use confirm-then-update like Q15.

**Common mistake:** no rollback. The box stays ticked after a failure, and the screen no longer matches the server.

### Q18. Edit a book (PUT)

**Look at the HTML:** `#q18-select`, `#q18-form` (title, author, year, genre, rating) and `#q18-status`. There's no `read` field in the form.

```js
// Q18
async function q18() {
  const select = document.querySelector('#q18-select');
  const form = document.querySelector('#q18-form');
  const status = document.querySelector('#q18-status');
  let current = null;

  const data = await api('/books?_sort=title');
  data.items.forEach((book) => {
    const option = document.createElement('option');
    option.value = book.id;
    option.textContent = book.title;
    select.append(option);
  });

  select.addEventListener('change', async () => {
    if (!select.value) return;
    current = await api(`/books/${select.value}`);
    form.elements.title.value = current.title;
    form.elements.author.value = current.author;
    form.elements.year.value = current.year;
    form.elements.genre.value = current.genre;
    form.elements.rating.value = current.rating;
    status.textContent = '';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!current) {
      status.textContent = 'Choose a book first.';
      return;
    }
    const book = {
      title: form.elements.title.value.trim(),
      author: form.elements.author.value.trim(),
      year: Number(form.elements.year.value),
      genre: form.elements.genre.value,
      rating: Number(form.elements.rating.value),
      read: current.read, // PUT replaces everything: keep what the form doesn't show
    };
    try {
      const saved = await api(`/books/${current.id}`, { method: 'PUT', body: book });
      current = saved;
      select.selectedOptions[0].textContent = saved.title;
      status.className = 'status ok';
      status.textContent = `Saved ${saved.title}`;
    } catch (error) {
      status.className = 'status error';
      status.textContent = `Save failed: ${error.message}`;
    }
  });
}
q18();
```

**Step by step**
1. Fill the select with options from the API (value = id).
2. On `change`, fetch the chosen book and copy its values into the form. Keep it in `current`.
3. On submit, build the **whole** book. `PUT` means "replace the record with this", so anything you leave out gets reset to its default. That's why `read` comes from `current`.
4. After success, update the **one** option whose text changed, using the server's answer.

**What you'll see:** pick a book, change its title, save → `Saved <new title>` and the dropdown shows the new title. Pick it again: the form shows the saved values.

**PUT or PATCH?** `PUT` sends the whole thing; `PATCH` sends only what changed (Q17). Read the API docs to see which one an endpoint supports.

**Common mistake:** sending only the form fields with `PUT`. The book's `read` silently becomes `false`. No error appears, which makes this bug hard to spot: compare **Payload** and **Response** in Network.

### Q19. Show the server's validation errors

**Look at the HTML:** each input in `#q19-form` is followed by `<small class="field-error" data-error-for="...">`, named after the field. The year input is `type="text"` on purpose.

```js
// Q19
document.querySelector('#q19-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  const status = document.querySelector('#q19-status');
  form.querySelectorAll('.field-error').forEach((slot) => { slot.textContent = ''; });
  form.querySelectorAll('.invalid').forEach((input) => input.classList.remove('invalid'));

  const yearText = form.elements.year.value.trim();
  const book = {
    title: form.elements.title.value.trim(),
    author: form.elements.author.value.trim(),
    year: yearText === '' ? null : Number(yearText),
    genre: form.elements.genre.value.trim(),
  };
  try {
    const created = await api('/books', { method: 'POST', body: book });
    status.className = 'status ok';
    status.textContent = `Created book #${created.id}`;
    form.reset();
  } catch (error) {
    status.className = 'status error';
    status.textContent = error.message;
    const fields = error.body?.fields ?? {};
    for (const [name, message] of Object.entries(fields)) {
      form.querySelector(`[data-error-for="${name}"]`).textContent = message;
      form.elements[name].classList.add('invalid');
    }
  }
});
```

**Step by step**
1. Clear old messages and red borders first. Otherwise a fixed field keeps its old error.
2. Send what was typed. `Number('abc')` is `NaN`, and `JSON.stringify` turns `NaN` into `null`, so the server says `year is required`.
3. The server answers `400` with `{ error: 'Validation failed', fields: { title: 'title is required', ... } }`. Our `api` helper put that body on `error.body`.
4. `Object.entries(fields)` gives `[name, message]` pairs. For each one, find the matching `<small>` and input by **name** and show the message.

**What you'll see:** with the suggested bad values: *title is required*, *author must be at least 2 characters*, *year is required*, *genre must be one of: ...*, and `Validation failed` at the bottom. Fix them and submit: `Created book #...`.

**Why the server checks too:** browser checks are for the user's convenience; anyone can skip them (DevTools, a script, an old page). The server must check everything, and a good front end shows the server's messages nicely.

**Common mistake:** `alert(error.message)` only. The user sees "Validation failed" but not **which** field or **why**. The details are in `error.body.fields`.

### Q20. Counts per genre, in parallel

**Look at the HTML:** an empty `#q20-list`.

```js
// Q20
async function q20() {
  const genres = ['fiction', 'fantasy', 'sci-fi', 'mystery', 'non-fiction'];
  const results = await Promise.all(
    genres.map((genre) => api(`/books?genre=${genre}&_limit=1`)),
  );
  const list = document.querySelector('#q20-list');
  list.replaceChildren(...results.map((data, i) => {
    const li = document.createElement('li');
    li.textContent = `${genres[i]}: ${data.total}`;
    return li;
  }));
}
q20();
```

**Step by step**
1. `genres.map(...)` starts **five** requests straight away and gives an array of five promises.
2. `Promise.all([...])` waits until **all** of them finish and gives the results in the **same order** as the genres, whichever answer came back first.
3. `_limit=1` keeps each answer tiny; we only need `total`.
4. `results[i]` lines up with `genres[i]`.

**What you'll see:** fiction: 3, fantasy: 3, sci-fi: 3, mystery: 3, non-fiction: 2. In Network's **Waterfall**, the five bars start at the same time.

**Common mistake:** `await` inside a `for` loop. It works, but the requests go one after another (five times slower). Use that only when each request needs the one before it (Q25).

---

## Tier 5: Applied

### Q21. Search as you type

**Look at the HTML:** `#q21-search`, `#q21-status`, `#q21-list`. There's no form and no button: this reacts to typing.

```js
// Q21
let q21Timer;
let q21Latest = 0;
document.querySelector('#q21-search').addEventListener('input', (event) => {
  const term = event.target.value.trim();
  const status = document.querySelector('#q21-status');
  const list = document.querySelector('#q21-list');
  clearTimeout(q21Timer);
  if (term === '') {
    q21Latest += 1; // any answer still on its way is now out of date
    list.textContent = '';
    status.textContent = '';
    return;
  }
  status.textContent = 'Searching…';
  q21Timer = setTimeout(async () => {
    const requestNumber = ++q21Latest;
    try {
      const data = await api(`/books?${new URLSearchParams({ q: term })}`);
      if (requestNumber !== q21Latest) return; // an old answer: ignore it
      renderTitles(list, data.items);
      status.textContent = data.total === 0 ? `No books match "${term}".` : `${data.total} found`;
    } catch (error) {
      if (requestNumber !== q21Latest) return;
      status.textContent = `Search failed: ${error.message}`;
    }
  }, 300);
});
```

**Which tools, and why**
- `input` event: fires on every change to the box (typing, pasting, deleting).
- **Debounce** with `setTimeout`/`clearTimeout`: each key cancels the previous timer, so the request only goes out 300 ms after the **last** key. Typing "wells" sends 1 request, not 5.
- **Request counter**: answers can arrive out of order (a slow answer for "we" might land after a fast answer for "wells"). Each request takes a number; when an answer arrives, it only gets drawn if its number is still the latest.

**What you'll see:** type `wells` quickly: `Searching…`, then `2 found`. Network shows **one** request. Clear the box: everything empties. With the random `_delay` test from the question, the list still always matches what's in the box.

**Common mistake:** no counter. With slow, uneven answers the list sometimes shows results for an **older** search than the text in the box. It's a real bug in real apps, and it only shows up sometimes, which makes it hard to find.

### Q22. Fix the broken "Add" button

**Look at the HTML:** `#q22-add` and `#q22-status`.

```js
// Q22 (fixed)
document.querySelector('#q22-add').addEventListener('click', async () => {
  const status = document.querySelector('#q22-status');
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Debugging Notes', author: 'You', year: 2026, genre: 'non-fiction' }),
    });
    const book = await response.json();
    if (!response.ok) throw new Error(book.error);
    status.textContent = `Added #${book.id}`;
  } catch (error) {
    status.textContent = `Add failed: ${error.message}`;
  }
});
```

**The six bugs, in the order you'll meet them**

| # | Clue | Where you see it | Fix |
|---|---|---|---|
| 1 | `TypeError: response.json is not a function` | Console | `await fetch(...)`: without it, `response` is a Promise |
| 2 | Page says `Added #undefined` | the page | `await response.json()`: without it, `book` is a Promise |
| 3 | `404` `No such route: POST /api/book` | Network → Response | the path is `/books`, plural |
| 4 | `415` `Content-Type must be application/json` (received `text/plain;charset=UTF-8`) | Network → Response | add `headers: { 'Content-Type': 'application/json' }` |
| 5 | `400` `Body is not valid JSON`, received `[object Object]` | Network → Payload and Response | `body: JSON.stringify({...})` |
| 6 | `400` `year must be a number (got "2026")`, but the page **still** says `Added #undefined` | Network, then the page | send `year: 2026`, **and** check `response.ok` so errors aren't reported as success |

**How to work it:** fix one thing, reload, click, and read the **next** clue. Don't change five things at once; you won't know which one mattered. The Console shows JavaScript problems (bugs 1-2). The Network tab shows HTTP problems (bugs 3-6): always read the status **and** the Response body, because this server explains itself.

**Common mistake:** stopping at bug 3 or 4 because "the request goes through now". Without bug 6's `response.ok` check, the page cheerfully says "Added" while the server said no.

### Q23. Filters that live in the address bar

**Look at the HTML:** `#q23-genre` (select), `#q23-unread` (checkbox), `#q23-list`.

```js
// Q23
const q23Genre = document.querySelector('#q23-genre');
const q23Unread = document.querySelector('#q23-unread');

async function loadQ23() {
  const pageParams = new URLSearchParams(location.search);
  if (q23Genre.value) pageParams.set('genre', q23Genre.value); else pageParams.delete('genre');
  if (q23Unread.checked) pageParams.set('unread', '1'); else pageParams.delete('unread');
  const query = pageParams.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);

  const apiParams = new URLSearchParams({ _sort: 'title' });
  if (q23Genre.value) apiParams.set('genre', q23Genre.value);
  if (q23Unread.checked) apiParams.set('read', 'false');
  const data = await api(`/books?${apiParams}`);
  const list = document.querySelector('#q23-list');
  renderTitles(list, data.items);
  if (data.items.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No books match these filters.';
    list.append(li);
  }
}

const startParams = new URLSearchParams(location.search);
q23Genre.value = startParams.get('genre') ?? '';
q23Unread.checked = startParams.get('unread') === '1';
q23Genre.addEventListener('change', loadQ23);
q23Unread.addEventListener('change', loadQ23);
loadQ23();
```

**Which tools, and why**
- There are **two** query strings here. The **page's** (`?genre=fantasy&unread=1`) is for people: reload, bookmark, share. The **API's** (`?genre=fantasy&read=false&_sort=title`) is for the server. They don't have to use the same names.
- `location.search` is the page's current query string. `URLSearchParams` reads and edits it.
- `history.replaceState(null, '', newUrl)` changes the address bar **without** reloading the page or adding a Back-button step.
- On load, read the address bar **first**, set the controls, **then** fetch. The controls are the state; the URL is a saved copy of it.

**What you'll see:** pick Fantasy and tick Only unread → Peter Pan and The Wonderful Wizard of Oz, and the address bar ends in `?genre=fantasy&unread=1`. Reload: the same filters and the same list.

**Common mistake:** setting `location.search = ...`. That **reloads** the page every time a filter changes.

### Q24. Fetch something that isn't JSON

**Look at the HTML:** `#q24-output` (a summary line) and `#q24-raw` (a `<pre>` that keeps line breaks). The file `reading-notes.md` sits next to `index.html`, so its URL is just `reading-notes.md`.

```js
// Q24
async function q24() {
  const output = document.querySelector('#q24-output');
  try {
    const response = await fetch('reading-notes.md');
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const text = await response.text();
    const lines = text.trim().split('\n');
    const heading = lines.find((line) => line.startsWith('# ')).slice(2);
    const items = lines.filter((line) => line.startsWith('- ')).length;
    output.textContent = `${lines.length} lines · title: ${heading} · ${items} list items`;
    document.querySelector('#q24-raw').textContent = text;
  } catch (error) {
    output.textContent = `Couldn't load the notes: ${error.message}`;
  }
}
q24();
```

**Which tools, and why**
- `fetch` loads **any** file. The method you call on the response decides how the body is read: `.json()` for JSON, `.text()` for text, Markdown, CSV or HTML.
- A relative URL (`'reading-notes.md'`) is relative to the page, so it comes from the same server.
- `trim()` removes the final newline, so `split('\n')` doesn't count an empty last line.
- `find` gets the first `# ` line; `.slice(2)` drops the `# `. `filter(...).length` counts the bullet lines.

**What you'll see:** `14 lines · title: Reading notes for the term · 3 list items`, with the raw Markdown below. In Network, the request's type is `fetch` and the response header is `Content-Type: text/markdown`. Change the file name to `missing.md` to see the error branch (`404 Not Found`).

**Going further:** a library such as markdown-it can turn the text into HTML. Only do that with Markdown you trust, because the output goes in as HTML, not text.

**Common mistake:** calling `.json()` on a Markdown file: *SyntaxError: Unexpected token '#', "# Reading "... is not valid JSON*.

### Q25. Reading dashboard (every page of results)

**Look at the HTML:** a `<dl id="q25-stats">` with four `<dd>` slots: `#q25-total`, `#q25-read`, `#q25-avg`, `#q25-genre`.

```js
// Q25
async function getAllBooks() {
  const all = [];
  let page = 1;
  let pages = 1;
  do {
    const data = await api(`/books?_limit=5&_page=${page}`);
    all.push(...data.items);
    pages = data.pages;
    page += 1;
  } while (page <= pages);
  return all;
}

async function q25() {
  const books = await getAllBooks();
  const read = books.filter((book) => book.read);
  const average = read.length === 0 ? 0 : read.reduce((sum, book) => sum + book.rating, 0) / read.length;

  const counts = {};
  read.forEach((book) => { counts[book.genre] = (counts[book.genre] ?? 0) + 1; });
  const topGenre = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'none yet';

  document.querySelector('#q25-total').textContent = books.length;
  document.querySelector('#q25-read').textContent = read.length;
  document.querySelector('#q25-avg').textContent = average.toFixed(1);
  document.querySelector('#q25-genre').textContent = topGenre;
}
q25();
```

**Which tools, and why**
- **A loop of awaits:** you only learn how many pages there are from the **first** answer, so the requests must go one after another. A `do...while` runs at least once, then keeps going while there are pages left. (This is the opposite of Q20, where all the URLs were known up front.)
- `all.push(...data.items)` adds each page's books to one big array.
- `filter` keeps the read books. `reduce` adds up their ratings. Guard against dividing by zero.
- Counting: `counts[genre] = (counts[genre] ?? 0) + 1` builds `{ fiction: 2, 'sci-fi': 3, ... }`. `Object.entries` + `sort` puts the biggest count first.
- `toFixed(1)` shows one decimal place: `4.0`, not `4`.

**What you'll see:** `14`, `8`, `4.0`, `sci-fi` with fresh data. Network shows `_page=1`, `_page=2` and `_page=3`, one after another.

**Common mistake:** fetching only page 1 and computing from it. The numbers look believable (5 books, 4 read...) and are simply wrong. Always check `pages` (or `total`) to know if there's more.

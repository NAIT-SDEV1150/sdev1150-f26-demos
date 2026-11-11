# Practice 23: consuming a REST API and rendering the data (25 questions)

This set goes with the class on consuming REST APIs (demo `22-rest-client`). It also reviews HTTP and JSON (T18) and fetch with `async`/`await` (T19), so it doubles as Quiz 3 practice.

## How to work

1. Open a terminal in this folder and start the practice API:
   ```bash
   npm start
   ```
   There's nothing to install. Leave the terminal open: it prints every request.
2. Open **http://localhost:3000** in your browser (not Live Server). Open DevTools: **Console** and **Network** (filter: Fetch/XHR).
3. Write every answer in `main.js`, one under the other, with a comment like `// Q1` above each. Save and reload after each one.
4. Wrap each answer in its own `async function` and call it (see Q1). Then one broken answer can't stop the others.
5. Some questions add, change or delete books. To get the original 14 books back, stop the server (Ctrl + C), run `npm run reset`, then `npm start` again.

**Rules:** `const`/`let`, arrow functions, template literals, `querySelector`, `addEventListener`, `textContent`. Don't use `innerHTML`. Don't change `index.html` or `styles.css`.

**Helper classes** (already in `styles.css`): `.empty`, `.error`, `.ok`, `.loading`, `.selected`, `.invalid`, `.muted`, `.is-read`.

**The practice API** (open http://localhost:3000/api to see it as JSON):

| Request | Answer |
|---|---|
| `GET /api/books` | `200` `{ items: [...], total, page, limit, pages }` |
| `GET /api/books?q=wells&genre=sci-fi&read=false&_sort=title&_order=desc&_page=1&_limit=5` | the same shape, searched, filtered, sorted and paged |
| `GET /api/books/5` | `200` one book · `404` `{ error: "books 99 not found" }` |
| `POST /api/books` (JSON body) | `201` the new book with its `id` · `400` `{ error: "Validation failed", fields: {...} }` |
| `PUT /api/books/5` (JSON body: the whole book) | `200` the saved book |
| `PATCH /api/books/5` (JSON body: only what changes) | `200` the saved book |
| `DELETE /api/books/5` | `204 No Content` (an empty body) |

A book looks like `{ "id": 5, "title": "...", "author": "...", "year": 1902, "genre": "mystery", "read": true, "rating": 5 }`. `genre` is one of `fiction`, `fantasy`, `sci-fi`, `mystery`, `non-fiction`. `year` and `rating` must be **numbers**. Add `_delay=800` to any API URL to slow the answer down. Send the header `X-Simulate-Error: 500` to make a request fail on purpose.

Answers and walkthroughs are in `WALKTHROUGH.md`. Try first, then check.

---

## Tier 1: Simple (one idea, one or two lines)

**Q1.** At the very top of `main.js`, add `const BASE_URL = 'http://localhost:3000/api';`. Then write `async function q1() { ... }` that fetches `${BASE_URL}/books` and puts the response's **status code** into `#q1-output`. Call `q1();` underneath. You should see `200`.

**Q2.** Fetch the books again, read the body with `.json()`, and show the `total` in `#q2-output` like this: `14 books`.

**Q3.** Without fetching anything, use `URLSearchParams` to build the query string for `{ genre: 'mystery', _page: 1, _limit: 2 }`. Show the string in `#q3-output`. (You should see `genre=mystery&_page=1&_limit=2`.)

**Q4.** Turn the object `{ title: 'Dune', year: 1965 }` into JSON text and show it in `#q4-output`.

**Q5.** Fetch the book with id `999` (it doesn't exist). Show `ok: false, status: 404` in `#q5-output`, using the response's real `ok` and `status` values.

## Tier 2: Easy

**Q6.** Write a helper `async function getJson(path)` that fetches `BASE_URL + path`, **throws an Error** if the response isn't OK, and otherwise returns the parsed JSON. Use it to show the title of book `5` in `#q6-output`.

**Q7.** Get the first 5 books **sorted by title** (`_sort=title`, `_page=1`, `_limit=5`). For each one, create an `<li>` with `createElement`, set its text to the title, and add it to `#q7-list`.

**Q8.** Get all the books in the `mystery` genre. Render each one into `#q8-list` using the `<template id="book-template">` in the HTML: fill `.book-title`, `.book-author` and `.book-year`.

**Q9.** Before you fetch, set `#q9-status` to `Loading…`. Then fetch `/books?_delay=800` (a slow answer). When it arrives, change the text to `Loaded 14 books.` (use the real `total`). If it fails, show an error message instead.

**Q10.** Search for `dragon` (`/books?q=dragon`). There are no matches, so show an **empty state**: one `<li class="empty">` in `#q10-list` that says `No books match "dragon".` (If there were matches, you'd list the titles.)

## Tier 3: Competent (what everyone must be able to do)

**Q11.** Write the full helper `async function api(path, options = {})`:
- If `options.body` is given, turn it into JSON text and add the `Content-Type: application/json` header.
- Read the response body safely, even when it's empty (`204 No Content`).
- If the response isn't OK, throw an Error whose `message` is the server's `error` text, with the status code saved as `error.status` and the whole body as `error.body`.
- Otherwise return the data.

Test it: show `Book 1: Pride and Prejudice · 404: books 999 not found` in `#q11-output`. The title comes from `api('/books/1')`; the second part comes from catching the error thrown by `api('/books/999')`. **Use `api()` for the rest of the set.**

**Q12.** Make the search form `#q12-form` work. On submit (don't let the page reload), search for what's in `#q12-search` and render `Title (Author)` for each match into `#q12-list`. In `#q12-status` show `2 results` (with the real number) or `No results for "zzz".` when nothing matches.

**Q13.** Master/detail. Render the 5 **oldest** books (`_sort=year&_limit=5`) as buttons inside `<li>`s in `#q13-list`. Each button shows the title and remembers the book's id in `data-id`. When a button is clicked, fetch that **one** book from `/books/<id>` and show it in `#q13-detail` as an `<h3>` (title) and a `<p>` like `Mary Shelley, 1818 · sci-fi`. Give the clicked button the class `selected` (and take it off the others). Use **one** click listener on the list.

**Q14.** Make the form `#q14-form` create a book with `POST`. Remember: form values are strings, and the API wants `year` as a number. On success, show `Created book #<id>: <title>` in `#q14-status` (using what the **server** sent back) and clear the form. On failure, show `Could not save: <message>`. Try submitting it empty first.

**Q15.** Render the 3 **newest** books (`_sort=id&_order=desc&_limit=3`) into `#q15-list`. Each `<li>` has the title in a `<span>` and a **Delete** button. When a Delete button is clicked: send the `DELETE`, **wait** for the server to succeed, show `Deleted <title>.` in `#q15-status`, then load the 3 newest again from the server and re-render. (This is "confirm-then-update".) If it fails, say so and leave the list alone.

## Tier 4: Advanced

**Q16.** Pagination. Show 4 books per page, sorted by title, in `#q16-list`. Show `Page 1 of 4` in `#q16-info` (use `page` and `pages` from the response). `#q16-prev` and `#q16-next` move between pages. Disable Previous on the first page and Next on the last.

**Q17.** Optimistic update. Render the first 5 books (`_sort=id&_limit=5`) into `#q17-list`, each as a checkbox (checked if `read` is true) with the title in a `<label>`. When a checkbox changes, **keep the new tick on screen straight away**, then send a `PATCH` with `{ read: <new value> }`. If the save works, show `Saved "<title>".` in `#q17-status`. If it fails, **put the checkbox back** and show `Couldn't save "<title>": <message>`. To test failures: when `#q17-fail` is ticked, add the header `X-Simulate-Error: 500` to the PATCH.

**Q18.** Edit with `PUT`. Fill `#q18-select` with one `<option>` per book (value = id, text = title, sorted by title). When the user picks a book, fetch it and fill `#q18-form`. On submit, `PUT` the **whole** book back (including `read`, which isn't in the form, so the server doesn't reset it). Show `Saved <title>` in `#q18-status` and update the selected option's text with the title the **server** returned.

**Q19.** Server-side validation messages. The form `#q19-form` posts a new book with exactly what was typed (convert `year` with `Number()` unless it's empty, then send `null`). When the server answers `400`, show each message from `error.body.fields` in the matching `<small data-error-for="...">` and add the class `invalid` to that input. Put the main `error.message` in `#q19-status`. Clear old messages before every submit. Try: empty title, author `A`, year `abc`, genre `poetry`.

**Q20.** Counts per genre. For each genre (`fiction`, `fantasy`, `sci-fi`, `mystery`, `non-fiction`), ask the API for that genre with `_limit=1` (you only need the `total`). Send all five requests **at the same time** with `Promise.all`. Render `fantasy: 3` style lines into `#q20-list`, in the order above.

## Tier 5: Applied (real problems: you decide which tools to use)

**Q21.** Search as you type in `#q21-search`. Requirements:
- Don't send a request on every key. Wait until the user stops typing for 300 ms.
- Show `Searching…` in `#q21-status` while you wait, then `<n> found` or `No books match "<text>".`
- Render `Title (Author)` lines in `#q21-list`. An empty box clears the list and the status.
- An **older** answer must never replace a newer one. (Test it: add `&_delay=${Math.round(Math.random() * 1500)}` to the request and type quickly.)

**Q22.** This code is supposed to add a book called "Debugging Notes" when you click `#q22-add`, and show `Added #<id>` in `#q22-status`. It's broken in **six** places. Paste it into `main.js`, then use the Console **and** the Network tab to find and fix each problem, one at a time. Write down what the browser or server told you for each one.

```js
document.querySelector('#q22-add').addEventListener('click', async () => {
  const response = fetch(`${BASE_URL}/book`, {
    method: 'POST',
    body: { title: 'Debugging Notes', author: 'You', year: '2026', genre: 'non-fiction' },
  });
  const book = response.json();
  document.querySelector('#q22-status').textContent = `Added #${book.id}`;
});
```

**Q23.** Filters that survive a reload. `#q23-genre` (a genre or All) and `#q23-unread` (only unread books) filter the list in `#q23-list` (`Title (Author)`, sorted by title). Whenever a filter changes, put the filters in the **page's** address bar, like `?genre=fantasy&unread=1` (use `history.replaceState`, so the page doesn't reload), then fetch and render. When the page **loads**, read the address bar and set the controls to match before the first fetch. Show an `.empty` item when nothing matches.

**Q24.** Not everything is JSON. Fetch the file `reading-notes.md` (it sits next to `index.html`). Show the raw text in `#q24-raw`. In `#q24-output` show `14 lines · title: Reading notes for the term · 3 list items`: count the lines (trim the text first), take the first line that starts with `# ` as the title, and count the lines that start with `- `. If the file can't be loaded, show a friendly error.

**Q25.** A reading dashboard. The API pages its results, and you must ask for **5 books at a time** (`_limit=5`). Fetch **every** page (you don't know how many until the first answer arrives), then fill in:
- `#q25-total`: how many books there are,
- `#q25-read`: how many have `read: true`,
- `#q25-avg`: the average `rating` of the read books, to 1 decimal place,
- `#q25-genre`: the genre with the most read books.

With fresh data you should see `14`, `8`, `4.0` and `sci-fi`.

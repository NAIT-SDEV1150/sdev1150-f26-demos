# Day 20 practice: HTTP, JSON and REST (25 questions)

**How to work**
- **JavaScript answers** go in `main.js`, one under the other, with a comment like `// Q1` above each. Run them with `node main.js` in a terminal (from this folder), or open `index.html` with Live Server and look in the Console.
- **Word answers** (meanings, predictions, "explain why") go in `main.js` as `//` comments.
- **Request answers** go in `practice.http` under the matching heading. You need the **REST Client** extension in VS Code and the **demo 18 server running** (`cd 18-http-json-rest`, `npm start`). Under each request, write what came back as a `#` comment.
- `API.md` is the documentation for both APIs the questions use. Reading it is part of the practice.

**Rules:** `const` and `let`, arrow functions, template literals. No `fetch` yet: that's next class.

**Tip:** for the request questions, start from a **freshly started** server and do the questions in order. Ids like 43 and 44 depend on what you created before.

Try each question first. Answers and step-by-step explanations are in `WALKTHROUGH.md`.

---

## Tier 1: Simple (one idea, one or two lines)

**Q1.** Write JSON **by hand**. Make a `const` called `bookText` that holds JSON text (a string) for a book with the title `Dune`, `412` pages, and `available` set to `true`. Log it.

**Q2.** Here is some JSON text:
```js
const weatherText = '{"city":"Edmonton","temperature":-12}';
```
Turn it into a JavaScript object with `JSON.parse` and log just the city.

**Q3.** Turn this object into JSON text with `JSON.stringify`. Log the text **and** its `typeof`.
```js
const classInfo = { course: 'SDEV1150', week: 10 };
```

**Q4.** In a comment, write what each status code means and which family (2xx, 4xx or 5xx) it belongs to: `200`, `201`, `404`, `500`.

**Q5.** Start the demo 18 server. In `practice.http`, send the request that's already under the Q5 heading. In a comment, write the status code you got and the value of `status` in the response body.

## Tier 2: Easy

**Q6.** This JSON is broken in **four** places. Find each problem, then write the fixed JSON in a `const fixedText` (use backticks so it can span lines). Prove it's fixed: parse it and log the `tags` array.
```text
{
  'title': 'Clean Code',
  pages: 464,
  "tags": ["code", "craft",],
  // my favourite
}
```

**Q7.** Pretty-print this object as JSON with a 2-space indent and log it.
```js
const order = { id: 501, items: [{ name: 'Tea', qty: 2 }, { name: 'Scone', qty: 1 }], paid: false };
```

**Q8.** This JSON text holds an **array**. Parse it, then log how many books there are and the title of the **second** book.
```js
const listText = '[{"id":1,"title":"The Hobbit"},{"id":2,"title":"Dune"},{"id":3,"title":"Emma"}]';
```

**Q9.** Here is a raw HTTP request, exactly as it travels over the network. In comments, name its **method**, **path**, **query string**, **host**, the two **headers** (and what each one tells the server), and the **body**.
```text
POST /api/books?notify=true HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Accept: application/json

{"title":"Emma","author":"Jane Austen"}
```

**Q10.** Use `API.md` (Part 1) to **predict** the status code for each request, on a freshly started server. Write your predictions as comments first. Then send all five in `practice.http` and check.
- a) `GET /api/books/7`
- b) `GET /api/books/8`
- c) `POST /api/books` with a correct JSON body for a new book (`Emma` by `Jane Austen`, 1815)
- d) `DELETE` the book that c) just created (look at the response to c) for its id)
- e) `GET /api/broken`

## Tier 3: Competent (everyone should be able to do these)

**Q11.** Write an arrow function `safeParse(text)`. It returns the parsed value if `text` is valid JSON. If not, it logs `Could not parse: ` followed by the error message, and returns `null`. Test it with `'{"ok":true}'`, `"{'ok':true}"` and `''` (an empty string).

**Q12.** Not everything survives the trip to JSON and back. Stringify this object and log the text. Then parse it back into `copy` and log `typeof copy.joined`, `'age' in copy` and `typeof copy.greet`. In a comment, list every property that changed or disappeared, and why.
```js
const profile = {
  name: 'Sam',
  age: undefined,
  greet() { return 'hi'; },
  joined: new Date('2026-09-02T15:00:00Z'),
  score: NaN,
  tags: ['a', undefined],
};
```

**Q13.** Design the REST endpoints for a music app with **playlists**, where each playlist has **songs**. Make an array `routes` of strings like `'GET /api/playlists'`, one for each job below, and log each one with `forEach`.
1. list all playlists
2. get playlist 5
3. create a playlist
4. replace playlist 5 completely
5. rename playlist 5 (change one field)
6. delete playlist 5
7. list the songs in playlist 5
8. add a song to playlist 5

**Q14.** In `practice.http`, write three GET requests: every book, book 42, and only the **checked-out** books (use the query string from `API.md`). In comments, write how many books are checked out and the year of book 42.

**Q15.** In `practice.http`, write a POST that creates a book of your choice with a `title`, `author` and `year`. Send it. In comments, write the status code, the new `id` and the `Location` header. Then write and send a GET for that new book.

## Tier 4: Advanced

**Q16.** `JSON.stringify` takes a second argument, the **replacer**. Use this object:
```js
const account = { id: 7, username: 'reader7', secretToken: 'abc123', email: 'r7@example.com' };
```
- a) Stringify it keeping **only** `id` and `username` (use an array as the replacer).
- b) Stringify everything **except** `secretToken` (use a function as the replacer).

**Q17.** Before you send a book to the Library API, you can check it yourself. Write `checkBook(book)` that returns an **array of messages**, empty if the book follows the body rules in `API.md`: `title` and `author` are non-empty strings; `year`, if present, is a whole number or `null`; `available`, if present, is `true` or `false`. Test it with:
```js
{ title: 'Emma', author: 'Jane Austen', year: 1815 }
{ title: '  ', year: '1815' }
{ title: 'Emma', author: 'Jane Austen', available: 'yes' }
```

**Q18.** **Idempotent** means "sending it once or ten times leaves the server in the same state". Test it in `practice.http`:
- send `PATCH /api/books/3` with `{ "available": false }` **twice**
- send the same POST (`{ "title": "Copy Test", "author": "Tester" }`) **twice**
- `DELETE` the **second** Copy Test book **twice**

Write every status code in comments. Then explain: which of the three are idempotent? Why is the second DELETE a 404, and why does that **not** break idempotence?

**Q19.** PUT or PATCH? In `practice.http`:
- send `PUT /api/books/7` with only `{ "available": false }`. Write the status and the `details`.
- send a correct PUT that marks book 7 as checked out
- send a PATCH that puts it back (`available: true`)

In a comment, explain why the first PUT failed, and when you'd choose PUT over PATCH.

**Q20.** You'll meet these `JSON.parse` error messages (this is how Chrome, Edge and Node word them). For each, write in a comment what caused it. Then write a `tryParse(label, text)` function that logs the error message, and call it with text that produces each one.
- a) `Unexpected token 'h', "hello" is not valid JSON`
- b) `"undefined" is not valid JSON`
- c) `Unexpected end of JSON input`
- d) `Expected double-quoted property name in JSON at position 16 (line 1 column 17)`
- e) `"[object Object]" is not valid JSON`

## Tier 5: Applied (real situations: you decide which tools to use)

**Q21.** A search box on a library page holds `the hobbit`, and a checkbox "only available" is ticked. Build the request URL for the Library API in code, so that spaces and special characters are written correctly in the query string, and log it. Then send that URL in `practice.http` and write which book(s) came back.

**Q22.** A page wants to remember the user's settings between visits. Browsers can store **text** only (that's `localStorage`, coming later), so the settings must become text and back. Write:
- `settingsToText(settings)`, which returns the text to store
- `textToSettings(text)`, which returns the settings object. If `text` is `null` (nothing saved yet) or isn't valid JSON (someone broke it), return the defaults `{ theme: 'light', fontSize: 16 }`. If only some settings were saved, fill in the rest from the defaults.

Test it with: saved `{ theme: 'dark', fontSize: 20 }`, the text `'{"theme":"dark"}'`, `null`, and the broken text `'{theme: dark}'`.

**Q23.** Read **Part 2** of `API.md` (Campus Events API). Under the Q23 heading in `practice.http`, write (don't send: it's made up) the full requests, with every header they need:
- a) list the **tech** events in **November 2026**
- b) register `Sam Example` (`sam@example.com`) for event 12
- c) cancel registration 88

Then, in comments, write the status code you'd get if: d) event 12 is full, e) you forget the API key header, f) you leave `email` out of the body.

**Q24.** A different API returns its list inside an object, with paging information. A classmate wrote this and got `TypeError: books.forEach is not a function`:
```js
const pageText = '{"data":[{"id":1,"title":"Emma"},{"id":2,"title":"Dune"}],"page":1,"perPage":2,"total":5}';
const books = JSON.parse(pageText);
books.forEach((book) => console.log(book.title));
```
Explain the error in a comment, fix the code so it logs each title, and log how many pages there are in total.

**Q25.** A classmate's page sends requests to the Library API, and every one fails. These are the rows from their DevTools **Network** tab (with the response body underneath). For each one, write in a comment what's wrong and how to fix it. Then, in `practice.http`, write one correct request that creates `Emma` by `Jane Austen`, and the corrected version of d).

| | Method | URL | Status | Response |
|---|---|---|---|---|
| a) | POST | `http://localhost:5173/api/books` | 404 | (not JSON: this port is the Vite dev server serving the page) |
| b) | POST | `http://localhost:3001/api/books` | 415 | `{ "error": "Content-Type must be application/json" }` |
| c) | POST | `http://localhost:3001/api/books` | 400 | `{ "error": "Invalid JSON in request body", "details": ["Expected property name or '}' in JSON at position 1 (line 1 column 2)"] }` · request body was `{title: "Emma", author: "Jane Austen"}` |
| d) | GET | `http://localhost:3001/api/book/2` | 404 | `{ "error": "Nothing here: GET /api/book/2" }` |

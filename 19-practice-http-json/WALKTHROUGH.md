# Day 20 practice: walkthrough and answers

Try each question on your own first. Then come here to check.

Every JavaScript answer below was run with Node, and the output shown is the real output. Every request was sent to the demo 18 server, starting from a fresh start and going in question order. (Chrome and Edge print the same error messages as Node. Firefox words them differently, but the cause is the same.)

Each question has four parts:
- **Answer:** the code (or the request, or the words)
- **Step by step:** what each part does
- **Why it works**
- **Common mistake**

---

## Tier 1: Simple

### Q1. Write JSON by hand

```js
const bookText = '{"title":"Dune","pages":412,"available":true}';
console.log(bookText);
```

You'll see: `{"title":"Dune","pages":412,"available":true}`

**Step by step**
1. The outside single quotes `'...'` make a normal JavaScript **string**. JSON is always text, so in JS it lives in a string.
2. Inside the string is the JSON: an object `{ }` with three **keys** in **double quotes**.
3. `"Dune"` is a string value, so it has double quotes. `412` is a number and `true` is a boolean, so they have **no** quotes.

**Why it works:** JSON's rules are strict: keys always in double quotes, strings in double quotes, numbers and `true`/`false`/`null` bare. Wrapping it in single quotes lets you use double quotes inside without escaping.

**Common mistake:** `const bookText = { title: 'Dune', pages: 412 };`. That's a JavaScript **object**, not JSON. It works in your code, but it isn't text, and it isn't what travels over the network. Another one: `"412"` in quotes, which makes the number a string.

### Q2. JSON.parse: text to object

```js
const weatherText = '{"city":"Edmonton","temperature":-12}';
const weather = JSON.parse(weatherText);
console.log(weather.city);
```

You'll see: `Edmonton`

**Step by step**
1. `weatherText` is a string. `weatherText.city` would be `undefined`: strings don't have a `city` property.
2. `JSON.parse(weatherText)` reads the text and **builds** a real JavaScript object from it.
3. Now `weather.city` works, because `weather` is an object.

**Why it works:** `JSON.parse` goes one way: **text in, value out**. Remember it as "parse = read".

**Common mistake:** forgetting to parse and writing `weatherText.city`. You get `undefined`, no error, and a blank spot on your page. If a value is mysteriously `undefined`, check `typeof` first: is it still a string?

### Q3. JSON.stringify: object to text

```js
const classInfo = { course: 'SDEV1150', week: 10 };
const classText = JSON.stringify(classInfo);
console.log(classText, typeof classText);
```

You'll see: `{"course":"SDEV1150","week":10} string`

**Step by step**
1. `JSON.stringify(classInfo)` turns the object into **JSON text**.
2. Look at the output: the keys now have double quotes, and `'SDEV1150'` became `"SDEV1150"`. That's JSON's style, not JavaScript's.
3. `typeof classText` is `'string'`. It's text now, ready to send or store.

**Why it works:** `JSON.stringify` is the opposite of `parse`: **value in, text out**. You use it whenever you send data in a request body or save it as text.

**Common mistake:** expecting `console.log(classInfo)` and `console.log(classText)` to look the same. The Console shows the object with arrows you can expand; the string prints flat, with double quotes. Only the string can be sent.

### Q4. What the status codes mean

```js
// 200 OK: it worked, here is what you asked for (2xx success)
// 201 Created: it worked and something new was made (2xx success)
// 404 Not Found: the server has nothing at that URL (4xx client error)
// 500 Internal Server Error: the server broke while handling it (5xx server error)
```

**Step by step**
1. Look at the **first digit**: it tells you the family.
2. **2xx** = success. **3xx** = go somewhere else. **4xx** = the **client** (you) asked wrongly. **5xx** = the **server** failed.
3. 201 is the "success, and I made something" version of 200. You get it after a POST.

**Why it works:** status codes are a short summary the server sends first, so the client knows what happened before reading the body.

**Common mistake:** thinking 404 means "the server is down". If you got a 404, the server is **up**: it answered you. It just has nothing at that URL. A server that's down gives no status at all ("connection refused").

### Q5. Your first request in REST Client

```http
### Q5: health check
GET {{host}}/api/health
# 200 OK, "status": "ok"
```

Response:
```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "status": "ok", "books": 5, "time": "2026-11-06T17:02:11.120Z" }
```

**Step by step**
1. Start the server: in a terminal in `18-http-json-rest`, run `npm start`. Wait for `Books API running at http://localhost:3001`.
2. In `practice.http`, click **Send Request** above `GET {{host}}/api/health`.
3. REST Client fills in `{{host}}` from the `@host` line, sends the request, and shows the response on the right: the **status line** first, then headers, then the body.
4. The server's terminal prints `GET /api/health -> 200`.

**Why it works:** a request needs only a method and a URL. GET requests have no body, so that one line is the whole request.

**Common mistake:** "Connection refused" (or `ECONNREFUSED`): the server isn't running, or it's on a different port. Look at the terminal. If it says the port is in use, another copy is already running.

---

## Tier 2: Easy

### Q6. Fix the broken JSON

```js
const fixedText = `{
  "title": "Clean Code",
  "pages": 464,
  "tags": ["code", "craft"]
}`;
const fixedBook = JSON.parse(fixedText);
console.log(fixedBook.tags);
```

You'll see: `[ 'code', 'craft' ]`

**Step by step:** the four problems were:
1. `'title': 'Clean Code'`: **single quotes**. JSON only allows double quotes, for keys and for strings.
2. `pages: 464`: the key has **no quotes**. Every key needs double quotes.
3. `["code", "craft",]`: a **trailing comma** after the last item. JSON doesn't allow it (JavaScript does).
4. `// my favourite`: a **comment**. JSON has no comments at all.

Then `JSON.parse` proves it: if any problem were left, it would throw a `SyntaxError` instead of printing the tags.

**Why it works:** JSON is deliberately small and strict so every language can read it the same way. JavaScript object syntax is looser, which is why JSON copied from JS code often breaks.

**Common mistake:** fixing three and missing the trailing comma. Look at the end of every list and object. A useful trick: paste the JSON into the demo 18 playground (`http://localhost:3001`) and press **Parse**: the error tells you the position of the first problem.

### Q7. Pretty-print

```js
const order = { id: 501, items: [{ name: 'Tea', qty: 2 }, { name: 'Scone', qty: 1 }], paid: false };
console.log(JSON.stringify(order, null, 2));
```

You'll see:
```text
{
  "id": 501,
  "items": [
    {
      "name": "Tea",
      "qty": 2
    },
    {
      "name": "Scone",
      "qty": 1
    }
  ],
  "paid": false
}
```

**Step by step**
1. The first argument is the value to turn into text.
2. The second argument is the **replacer**. `null` means "keep everything" (Q16 uses it).
3. The third argument is the **indent**: `2` means two spaces per level, with every item on its own line.

**Why it works:** without the indent, JSON comes out on one line, which is good for sending but hard to read. With it, you can see the shape: an object holding an array holding objects.

**Common mistake:** `JSON.stringify(order, 2)`. The `2` lands in the replacer's spot and is ignored, so you get one long line. The indent is the **third** argument.

### Q8. Parse an array

```js
const listText = '[{"id":1,"title":"The Hobbit"},{"id":2,"title":"Dune"},{"id":3,"title":"Emma"}]';
const list = JSON.parse(listText);
console.log(list.length, list[1].title);
```

You'll see: `3 Dune`

**Step by step**
1. The text starts with `[`, so the top level is an **array**.
2. `JSON.parse` gives you a real array of three objects.
3. `list.length` is `3`. `list[1]` is the **second** item (arrays count from 0), and `.title` is `Dune`.

**Why it works:** JSON arrays become JavaScript arrays, so every array method you know (`length`, `forEach`, `map`, `filter`) works on the result.

**Common mistake:** `listText.length`, which gives the number of **characters** in the string (here 79), not the number of books.

### Q9. Label the parts of a request

```js
// method: POST
// path: /api/books
// query string: ?notify=true  (one parameter: notify = "true")
// host: localhost:3001
// Content-Type: application/json -> "the body I'm sending is JSON"
// Accept: application/json       -> "please send JSON back"
// body: {"title":"Emma","author":"Jane Austen"}
```

**Step by step**
1. The **first line** is the request line: method, then the path with its query string, then the HTTP version.
2. Everything after `?` is the **query string**: `name=value` pairs, joined with `&`.
3. The next lines, up to the **blank line**, are **headers**: `Name: value`, one per line. `Host` says which server and port.
4. After the blank line comes the **body**: here, JSON text describing the new book.

**Why it works:** every HTTP request has this shape. Seeing it raw once makes the DevTools Network tab and REST Client make sense: they show these same parts in boxes.

**Common mistake:** thinking the query string is part of the path. The path is `/api/books`. The query string is extra information **about** the request (filters, options), not a different resource.

### Q10. Predict, then check

```js
// a) GET /api/books/7       -> 200 (book 7 exists: Dune)
// b) GET /api/books/8       -> 404 (no book 8: ids are 1, 2, 3, 7, 42)
// c) POST /api/books valid  -> 201 Created
// d) DELETE /api/books/43   -> 204 No Content
// e) GET /api/broken        -> 500
```

```http
### Q10: check your predictions (a to e)
GET {{host}}/api/books/7

###
GET {{host}}/api/books/8

###
POST {{host}}/api/books
Content-Type: application/json

{ "title": "Emma", "author": "Jane Austen", "year": 1815 }

###
DELETE {{host}}/api/books/43

###
GET {{host}}/api/broken
```

**Step by step**
1. a) and b): `API.md` says a fresh server has ids 1, 2, 3, 7 and 42. 7 exists (200); 8 doesn't (404). Ids don't have to be in a row.
2. c): the docs say POST answers **201** with the new book. On a fresh server its id is **43**, and the response has `Location: /api/books/43`.
3. d): DELETE answers **204**: success, and **no body**. An empty response panel is normal here.
4. e): the docs say `/api/broken` always gives 500.

**Why it works:** good API docs list the status codes for every endpoint. Predicting first, then checking, is how you learn to read them.

**Common mistake:** expecting a body from the DELETE and thinking it failed. Look at the status line, not the body: 204 means it worked.

---

## Tier 3: Competent

### Q11. A safe parse

```js
const safeParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.log(`Could not parse: ${error.message}`);
    return null;
  }
};
console.log(safeParse('{"ok":true}'));
console.log(safeParse("{'ok':true}"));
console.log(safeParse(''));
```

You'll see:
```text
{ ok: true }
Could not parse: Expected property name or '}' in JSON at position 1 (line 1 column 2)
null
Could not parse: Unexpected end of JSON input
null
```

**Step by step**
1. `try { ... }` runs code that might **throw** an error.
2. If `JSON.parse` succeeds, `return` hands back the value and the `catch` is skipped.
3. If it throws, JavaScript jumps to `catch (error)`. `error.message` is the readable part of the error.
4. You log it and return `null`, so the code that called `safeParse` gets a clear "nothing" instead of crashing.

**Why it works:** `JSON.parse` doesn't return a special value for bad text: it **throws**, and an uncaught throw stops your script. `try`/`catch` catches it.

**Common mistake:** putting `try`/`catch` around the wrong line, or leaving the `return` out of the `try`, so you always get `undefined`. Also: `''` (empty text) is not valid JSON. An empty response body will throw "Unexpected end of JSON input".

### Q12. What survives JSON

```js
const profileText = JSON.stringify(profile);
console.log(profileText);
const copy = JSON.parse(profileText);
console.log(typeof copy.joined, 'age' in copy, typeof copy.greet);
// age: undefined      -> gone (JSON has no undefined, so the key is skipped)
// greet(): a function -> gone (JSON can't hold functions)
// joined: a Date      -> became a string "2026-09-02T15:00:00.000Z" (Dates turn into text)
// score: NaN          -> became null (JSON has no NaN or Infinity)
// tags[1]: undefined  -> became null (inside an array, undefined turns into null so the positions stay the same)
```

You'll see:
```text
{"name":"Sam","joined":"2026-09-02T15:00:00.000Z","score":null,"tags":["a",null]}
string false undefined
```

**Step by step**
1. JSON can hold only six kinds of value: **string, number, boolean, null, array, object**.
2. Anything else gets changed or dropped by `stringify`: functions and `undefined` properties vanish; `NaN` becomes `null`; a `Date` becomes an ISO date string.
3. After `parse`, `copy.joined` is a **string**, not a Date. If you need a Date again, write `new Date(copy.joined)`.

**Why it works:** JSON is a data format shared by every language. Functions and JavaScript-only values like `undefined` have no meaning to a Python or Java server, so JSON leaves them out.

**Common mistake:** sending an object with `undefined` fields and expecting the server to "see" them. It never receives those keys. Use `null` when you mean "deliberately empty".

### Q13. Design REST URLs

```js
const routes = [
  'GET /api/playlists',
  'GET /api/playlists/5',
  'POST /api/playlists',
  'PUT /api/playlists/5',
  'PATCH /api/playlists/5',
  'DELETE /api/playlists/5',
  'GET /api/playlists/5/songs',
  'POST /api/playlists/5/songs',
];
routes.forEach((route) => console.log(route));
```

**Step by step**
1. The **resource** is a plural noun: `playlists`. The **collection** URL is `/api/playlists`; one **item** is `/api/playlists/5`.
2. The **method** says the action: GET reads, POST creates, PUT replaces, PATCH changes part, DELETE removes.
3. Rename = change one field, so it's **PATCH** with a body like `{ "name": "Road Trip" }`.
4. Songs belong to a playlist, so they hang off it: `/api/playlists/5/songs`. Adding one is a POST to that collection.

**Why it works:** in REST, the URL names **what** (a noun), and the method says **what to do** with it. The same URL with a different method is a different action.

**Common mistake:** verbs in URLs: `/api/getPlaylists`, `/api/playlists/5/delete`, `/api/renamePlaylist`. They work, but they aren't REST, and they repeat what the method already says.

### Q14. Three GET requests

```http
### Q14: three GET requests
GET {{host}}/api/books
# 200, 5 books

###
GET {{host}}/api/books/42
# 200, year 1979

###
GET {{host}}/api/books?available=false
# 200, 1 book is checked out (Anne of Green Gables)
```

**Step by step**
1. The collection URL returns an **array**.
2. The item URL returns **one object**. Book 42's `year` is `1979`.
3. The query string `?available=false` asks the server to **filter** the collection. Same resource, fewer results.

**Why it works:** `API.md` lists `available` as a query parameter for `GET /api/books`. Query strings are for searching, filtering, sorting and paging.

**Common mistake:** `GET {{host}}/api/books/available=false` (no `?`). The server treats `available=false` as an id and answers 400 "not a valid id".

### Q15. Create, then read it back

```http
### Q15: create a book, then GET it
POST {{host}}/api/books
Content-Type: application/json

{
  "title": "Station Eleven",
  "author": "Emily St. John Mandel",
  "year": 2014
}
# 201 Created, id 44, Location: /api/books/44

###
GET {{host}}/api/books/44
# 200
```

**Step by step**
1. Request line: `POST` and the **collection** URL (you don't know the id yet: the server picks it).
2. The header `Content-Type: application/json` tells the server the body is JSON.
3. **One blank line**, then the JSON body.
4. The response: **201 Created**, the new book with `"id": 44` (43 was used and deleted in Q10), and a `Location` header saying where it lives.
5. A GET to that location proves it was saved.

**Why it works:** that's the REST pattern for creating: POST to the collection, and the server answers with the new item and its URL.

**Common mistake:** forgetting the `Content-Type` line (415), or leaving out the blank line between the headers and the body, so the body is read as more headers and the request breaks. Also: POSTing to `/api/books/44`, which gives 405 (POST isn't allowed on an item).

---

## Tier 4: Advanced

### Q16. The replacer

```js
const account = { id: 7, username: 'reader7', secretToken: 'abc123', email: 'r7@example.com' };
console.log(JSON.stringify(account, ['id', 'username']));
console.log(JSON.stringify(account, (key, value) => (key === 'secretToken' ? undefined : value)));
```

You'll see:
```text
{"id":7,"username":"reader7"}
{"id":7,"username":"reader7","email":"r7@example.com"}
```

**Step by step**
1. a) An **array** replacer is an allow-list: only those keys are written.
2. b) A **function** replacer is called for every key with `(key, value)`. Whatever it returns is written. Returning `undefined` means "leave this key out" (the same rule as Q12).
3. For every other key, return `value` unchanged.

**Why it works:** the replacer runs during stringifying, so you control exactly what leaves your code.

**Common mistake:** in the function, forgetting to `return value` for the other keys. Then everything is `undefined`, and the result is `undefined` too, not even `{}`.

### Q17. Check before you send

```js
const checkBook = (book) => {
  const errors = [];
  if (typeof book.title !== 'string' || book.title.trim() === '') errors.push('title must be a non-empty string');
  if (typeof book.author !== 'string' || book.author.trim() === '') errors.push('author must be a non-empty string');
  if ('year' in book && book.year !== null && !Number.isInteger(book.year)) errors.push('year must be a whole number or null');
  if ('available' in book && typeof book.available !== 'boolean') errors.push('available must be true or false');
  return errors;
};
console.log(checkBook({ title: 'Emma', author: 'Jane Austen', year: 1815 }));
console.log(checkBook({ title: '  ', year: '1815' }));
console.log(checkBook({ title: 'Emma', author: 'Jane Austen', available: 'yes' }));
```

You'll see:
```text
[]
[
  'title must be a non-empty string',
  'author must be a non-empty string',
  'year must be a whole number or null'
]
[ 'available must be true or false' ]
```

**Step by step**
1. Start with an empty array and `push` a message for every rule that fails. That way you report **all** the problems, not just the first.
2. `typeof ... !== 'string'` catches a missing title (`undefined`) and wrong types; `.trim() === ''` catches one made only of spaces.
3. `'year' in book` checks whether the key is there at all, because `year` is optional.
4. `Number.isInteger('1815')` is `false`: a **string** of digits is not a number. That's exactly the mistake JSON helps you catch.

**Why it works:** each line is one rule from the docs. An empty array means "good to send".

**Common mistake:** `if (!book.year)`, which treats `0` and `null` as "missing", and lets `'1815'` through. Check the type, not truthiness.

### Q18. Idempotence

```http
### Q18: same request twice (PATCH, POST, DELETE)
PATCH {{host}}/api/books/3
Content-Type: application/json

{ "available": false }
# 200

###
PATCH {{host}}/api/books/3
Content-Type: application/json

{ "available": false }
# 200: same book, same result

###
POST {{host}}/api/books
Content-Type: application/json

{ "title": "Copy Test", "author": "Tester" }
# 201, id 45

###
POST {{host}}/api/books
Content-Type: application/json

{ "title": "Copy Test", "author": "Tester" }
# 201, id 46: a SECOND book

###
DELETE {{host}}/api/books/46
# 204

###
DELETE {{host}}/api/books/46
# 404: already gone
```

```js
// PATCH (setting a value) and DELETE are idempotent: doing them twice leaves the
// server exactly as doing them once. POST is not: every POST made another book.
// The second DELETE is a 404 because the book was already gone. The RESPONSE is
// different, but the server's STATE is the same (no book 46), and idempotence is
// about the state.
```

**Step by step**
1. PATCH twice: book 3 ends up `available: false` either way. Same state.
2. POST twice: two books, 45 and 46. **Different** state each time.
3. DELETE twice: after the first, book 46 is gone. The second finds nothing (404), and the server still has no book 46. Same state.

**Why it works:** GET, PUT and DELETE are meant to be idempotent, and so is a PATCH that **sets** values like this one. POST is not. This matters when a request might be sent twice, like a double-click or a retry on a bad connection: a repeated POST makes duplicates.

**Common mistake:** "the second DELETE failed, so DELETE isn't idempotent". Idempotent is about what's on the server afterwards, not about getting the same status code.

### Q19. PUT or PATCH

```http
### Q19: PUT vs PATCH
PUT {{host}}/api/books/7
Content-Type: application/json

{ "available": false }
# 400, details: ["title is required", "author is required"]

###
PUT {{host}}/api/books/7
Content-Type: application/json

{ "title": "Dune", "author": "Frank Herbert", "year": 1965, "available": false }
# 200

###
PATCH {{host}}/api/books/7
Content-Type: application/json

{ "available": true }
# 200
```

```js
// PUT means "here is the WHOLE new book: replace the old one". A body with only
// "available" would be a book with no title or author, so the server refused (400).
// PATCH means "change just these fields". Use PUT when you have the complete object
// (for example an edit form with every field); use PATCH for a small change like a toggle.
```

**Step by step**
1. The first PUT sends a body that isn't a complete book. The docs say PUT needs `title` and `author`, so you get 400 with the reasons in `details`.
2. The correct PUT sends every field. Anything you leave out would go back to its default.
3. The PATCH sends only `available`, and everything else stays as it was.

**Why it works:** PUT and PATCH both update, but PUT **replaces** and PATCH **merges**.

**Common mistake:** using PUT for a one-field change on an API that accepts it: the other fields are quietly wiped or reset to defaults. Read the docs for what PUT does with missing fields.

### Q20. Error detective

```js
// a) The text isn't JSON at all: JSON.parse expected { [ " a digit, true, false or null, and found h.
// b) Someone passed undefined; it was turned into the text "undefined", which isn't JSON.
// c) The text was empty (often an empty response body, or nothing saved yet).
// d) A trailing comma: after the comma, JSON expects another "key", but found }.
// e) An OBJECT was passed instead of text; JavaScript turned it into "[object Object]".
//    Usually it was already parsed, or you forgot JSON.stringify when saving it.
const tryParse = (label, text) => {
  try {
    JSON.parse(text);
  } catch (error) {
    console.log(label, error.message);
  }
};
tryParse('a', 'hello');
tryParse('b', String(undefined));
tryParse('c', '');
tryParse('d', '{"title":"Emma",}');
tryParse('e', String({ title: 'Emma' }));
```

You'll see:
```text
a Unexpected token 'h', "hello" is not valid JSON
b "undefined" is not valid JSON
c Unexpected end of JSON input
d Expected double-quoted property name in JSON at position 16 (line 1 column 17)
e "[object Object]" is not valid JSON
```

**Step by step**
1. Read the message: it says **what** the parser found and **where** (`position 16` counts characters from 0).
2. `"undefined"` and `"[object Object]"` in a message mean a JavaScript value got turned into text by accident. The real bug is earlier in your code.
3. For d), count: `{"title":"Emma",` is 16 characters, so position 16 is the `}` where a new key should be.

**Why it works:** these five messages cover most JSON bugs you'll see this term. Recognising them saves a lot of guessing.

**Common mistake:** "fixing" e) by adding more `JSON.parse`. If you already have an object, don't parse it again: just use it.

---

## Tier 5: Applied

### Q21. Build a search URL

```js
const searchText = 'the hobbit';
const onlyAvailable = true;
const params = new URLSearchParams({ q: searchText, available: String(onlyAvailable) });
const searchUrl = `http://localhost:3001/api/books?${params}`;
console.log(searchUrl);
```

You'll see: `http://localhost:3001/api/books?q=the+hobbit&available=true`

```http
### Q21: the search URL
GET {{host}}/api/books?q=the+hobbit&available=true
# 200, [The Hobbit]
```

**Step by step**
1. A URL can't contain a plain space, and characters like `&`, `=` and `?` have special meanings. Values must be **encoded**.
2. `new URLSearchParams({ ... })` takes `name: value` pairs and builds a correctly encoded query string. A space becomes `+`.
3. Putting it in a template literal turns it into text: `q=the+hobbit&available=true`.
4. The server decodes `+` back into a space and searches for `the hobbit`. Only *The Hobbit* matches.

**Why it works:** `URLSearchParams` handles the encoding rules for you, so a search like `rock & roll` can't break the URL.

**Common mistake:** gluing strings: `` `?q=${searchText}` `` gives `?q=the hobbit`. If the user types `&`, it gets worse: `?q=rock & roll` would split into two parameters.

### Q22. Settings as text

```js
const DEFAULT_SETTINGS = { theme: 'light', fontSize: 16 };
const settingsToText = (settings) => JSON.stringify(settings);
const textToSettings = (text) => {
  if (text === null) return { ...DEFAULT_SETTINGS };
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(text) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};
const saved = settingsToText({ theme: 'dark', fontSize: 20 });
console.log(saved);
console.log(textToSettings(saved));
console.log(textToSettings('{"theme":"dark"}'));
console.log(textToSettings(null));
console.log(textToSettings('{theme: dark}'));
```

You'll see:
```text
{"theme":"dark","fontSize":20}
{ theme: 'dark', fontSize: 20 }
{ theme: 'dark', fontSize: 16 }
{ theme: 'light', fontSize: 16 }
{ theme: 'light', fontSize: 16 }
```

**Step by step**
1. Saving: `JSON.stringify` turns the object into text, the only thing text storage can hold.
2. Loading: `null` means nothing was saved yet, so return a **copy** of the defaults.
3. `{ ...DEFAULT_SETTINGS, ...JSON.parse(text) }` spreads the defaults first, then the saved values on top. Saved values win, and anything missing comes from the defaults (`fontSize: 16` in the third test).
4. Broken text throws, and the `catch` falls back to the defaults, so the page still loads.

**Why it works:** that's the same JSON round trip as a request body, just going to storage instead of the network. (`localStorage.setItem` and `getItem` take and give text, and `getItem` returns `null` when nothing is there.)

**Common mistake:** returning `DEFAULT_SETTINGS` itself instead of a copy. Code that later changes the settings would quietly change the defaults too.

### Q23. Write requests from someone else's docs

```http
### Q23: Campus Events requests (written, NOT sent: this API is made up)
@events = https://events.example.com/v1
@key = YOUR-KEY-HERE

### a) tech events in November 2026
GET {{events}}/events?month=2026-11&category=tech
X-Api-Key: {{key}}

### b) register for event 12
POST {{events}}/events/12/registrations
X-Api-Key: {{key}}
Content-Type: application/json

{ "name": "Sam Example", "email": "sam@example.com" }

### c) cancel registration 88
DELETE {{events}}/registrations/88
X-Api-Key: {{key}}

# d) event 12 is full -> 409 Conflict
# e) no X-Api-Key header -> 401 Unauthorized
# f) no "email" in the body -> 400 Bad Request
```

**Step by step**
1. Find the **base URL** and the **authentication** rule first: every request needs `X-Api-Key`.
2. a) The endpoint is `GET /events`. The parameter table says `month` uses `YYYY-MM` format, so `month=2026-11`.
3. b) Registering is a POST to the event's `registrations` collection: `/events/12/registrations`. It has a body, so it needs `Content-Type`.
4. c) Cancelling uses a **different** path: `/registrations/88`, not under the event. Read the docs; don't guess.
5. d) to f) come straight from each endpoint's status list.

**Why it works:** every API doc answers the same questions: base URL, authentication, endpoints, parameters, body and status codes. Once you know where to look, a new API takes minutes.

**Common mistake:** `month=November` or `month=11`. The docs say `YYYY-MM`, and the server will either reject it or quietly return nothing.

### Q24. The data is one level down

```js
// The top level of this JSON is an OBJECT ({ data, page, perPage, total }), not an array.
// Objects don't have forEach, so books.forEach is "not a function". The array is in .data.
const pageText = '{"data":[{"id":1,"title":"Emma"},{"id":2,"title":"Dune"}],"page":1,"perPage":2,"total":5}';
const result = JSON.parse(pageText);
result.data.forEach((book) => console.log(book.title));
console.log('pages:', Math.ceil(result.total / result.perPage));
```

You'll see:
```text
Emma
Dune
pages: 3
```

**Step by step**
1. Look at the **first character** of the JSON: `{` means an object, `[` means an array.
2. The books are in the `data` property, so loop over `result.data`.
3. 5 books at 2 per page is 2.5 pages. `Math.ceil` rounds **up**, because the half page still needs a page: 3.

**Why it works:** many real APIs wrap lists like this so they can add paging information beside them. Check the shape (`console.log(result)`) before you write the loop.

**Common mistake:** naming the parsed value `books` when it isn't the list, which is how this bug happened. Name variables after what they really are (`result`, `page`, `response`).

### Q25. Network tab detective

```js
// a) Wrong PORT: 5173 is the Vite dev server (the page), not the API. The API is on 3001.
// b) Missing header: the request had no "Content-Type: application/json", so the API refused it (415).
// c) Invalid JSON body: the keys have no double quotes. Send {"title": "Emma", "author": "Jane Austen"}.
//    (Usually this means the body was written by hand instead of with JSON.stringify.)
// d) Wrong PATH: /api/book/2 should be /api/books/2 (plural). "Nothing here" is the server's own 404.
```

```http
### Q25: the corrected requests
POST {{host}}/api/books
Content-Type: application/json

{ "title": "Emma", "author": "Jane Austen" }
# 201 Created

###
GET {{host}}/api/books/2
# 200
```

**Step by step**
1. Check the URL in parts: **protocol, host, port, path, query string**. a) has the wrong port; d) has the wrong path.
2. For a 4xx, read the **response body**: this API tells you exactly what it didn't like (b and c).
3. The fixed request has the right port, the header and valid JSON, so it gets **201**.

**Why it works:** the Network tab shows the method, URL, status, request headers, request body and response for every request. Those details almost always point at the cause.

**Common mistake:** changing the server code to "fix" a client mistake. In all four cases the server was right: the requests were wrong. Read the status code and body before touching anything.

# Demo 18: HTTP, JSON and REST (a local Books API)

A tiny web **server** that runs on your own computer and answers HTTP requests with JSON. You are the **client**: your browser, the VS Code REST Client, or Thunder Client.

It uses only what comes with Node (no packages to download), the same way the Assignment 3 backend is a plain Node `http` server.

## Run it

You need Node.js 20 or newer (`node --version` to check).

```bash
cd 18-http-json-rest
npm install      # nothing to download, but it's a good habit
npm start        # or: npm run dev   (restarts when you save server.js)
```

You should see:

```text
Books API running at http://localhost:3001
Try http://localhost:3001/api/books   (press Ctrl+C to stop)
```

Leave that terminal open: the server runs until you press **Ctrl+C**. Every request it answers is printed there, for example `GET /api/books/42 -> 200`.

- **Port already in use?** Another server is on 3001. Stop it, or run `PORT=3002 npm start` (Windows PowerShell: `$env:PORT=3002; npm start`) and change `@host` in `requests.http`.
- **Reset the data:** stop and start the server. The books live in memory and are re-loaded from `books.json` each time, so nothing you add or delete is saved.

## Try it three ways

1. **The browser.** Open <http://localhost:3001>. The page has a link for each GET request and a JSON playground for `JSON.parse` and `JSON.stringify`. Open DevTools (F12) → **Network** first, so you can see each request, its status code and its headers.
2. **VS Code REST Client.** Install the **REST Client** extension (by Huachao Mao). Open `requests.http` and click **Send Request** above any request. The response (status line, headers, body) opens beside it. Run them in order on a freshly started server: request 8 creates book 43, and requests 12-16 use it. (If you POST more than once, the new id is 44, 45 and so on: change the id in 12-16 to match.)
3. **Thunder Client** (another VS Code extension) or Postman. Make a new request, pick the method, paste the URL, and for POST/PUT/PATCH choose **Body → JSON**.

## The API

Base URL: `http://localhost:3001`. Every response body is JSON, except 204 and 301, which have no body.

A book looks like this:

```json
{ "id": 42, "title": "The Hitchhiker's Guide to the Galaxy", "author": "Douglas Adams", "year": 1979, "available": true }
```

| Method | Path | What it does | Success | Errors |
|---|---|---|---|---|
| GET | `/api/books` | List every book | 200 + array | |
| GET | `/api/books?q=text` | Books whose title or author contains `text` (not case sensitive) | 200 + array (maybe empty) | |
| GET | `/api/books?available=true` | Only available (or `false`: only checked-out) books. Combine with `&q=` | 200 + array | |
| GET | `/api/books/:id` | One book | 200 + object | 400 bad id · 404 not found |
| POST | `/api/books` | Create a book. Body: `title` and `author` (required), `year`, `available` | 201 + the new book + `Location` header | 400 invalid JSON or failed checks · 415 no JSON Content-Type |
| PUT | `/api/books/:id` | **Replace** the whole book. Same body rules as POST; fields you leave out go back to their defaults | 200 + the book | 400 · 404 · 415 |
| PATCH | `/api/books/:id` | **Change** only the fields you send | 200 + the book | 400 · 404 · 415 |
| DELETE | `/api/books/:id` | Remove the book | 204, no body | 404 |
| GET | `/api/health` | Is the server up? | 200 | |
| GET | `/old-books` | Old address, kept for teaching | 301 → `/api/books` | |
| GET | `/api/broken` | Fails on purpose | | 500 |

**Rules for the body (POST, PUT, PATCH):**
- Send the header `Content-Type: application/json`, or you get **415**.
- The body must be valid JSON (double quotes, no trailing commas, no comments), or you get **400** with `"error": "Invalid JSON in request body"`.
- `title` and `author`: non-empty strings. `year`: a whole number or `null`. `available`: `true` or `false`. Other fields are ignored, and you can't change `id`.
- Defaults: `year` is `null` and `available` is `true`.

Errors always look like this:

```json
{ "error": "Validation failed", "details": ["author is required"] }
```

Using a method a path doesn't support (for example `DELETE /api/books`) gives **405** with an `Allow` header listing the methods that do work.

## What's in the folder

| File | What it is |
|---|---|
| `server.js` | The whole API: helpers, one function per route, then the part that matches method + path to a route. Read it top to bottom. |
| `mini-server.mjs` | The smallest version: two GET routes in about 20 lines. Run `node mini-server.mjs`, then open <http://localhost:3002/api/books>. |
| `books.json` | The starting data (JSON on disk) |
| `requests.http` | 19 ready-made requests for the REST Client |
| `public/` | The web page at <http://localhost:3001>: GET links and the JSON playground |

## How the server works (the short version)

1. `http.createServer(...)` makes a server. The function you give it runs **once for every request**, with `req` (the request that came in) and `res` (the response you're building).
2. It reads `req.method` (GET, POST, ...) and the path from `req.url`, and picks a route.
3. For POST/PUT/PATCH, it reads the body text and turns it into an object with `JSON.parse`.
4. It answers with `res.writeHead(status, headers)` and `res.end(JSON.stringify(data))`.

Next class we write the other side: front-end JavaScript that calls these URLs with `fetch`.

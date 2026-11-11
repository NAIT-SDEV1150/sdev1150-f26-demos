# 22 · REST client: the Kaktus Plant Shop

A complete front end that **consumes a REST API**: it lists plants, shows one plant's details, and creates, updates and deletes plants. It comes with its own tiny API, so everything runs on your computer.

This is front-end development: JavaScript in the browser asks a server for data (JSON), then builds the HTML on the page from that data.

## Run it

You need Node.js (version 18 or newer). There are no packages to install.

```bash
cd demos/22-rest-client
npm start
```

Then open **http://localhost:3000** in your browser. Keep the terminal open: every request the page makes is printed there.

| Command | What it does |
|---|---|
| `npm start` | Starts the API and serves the page at http://localhost:3000 |
| `npm run reset` | Puts the plant data back to how it started (`data/seed.json` → `data/db.json`) |
| `DELAY=0 npm start` | No fake delay (the default 300 ms delay lets you see the loading states) |
| `CORS=off npm start` | Turns CORS off so you can see a CORS error on purpose (see below) |

On Windows PowerShell, set a variable like this: `$env:DELAY=0; npm start`.

Stop the server with **Ctrl + C**.

## What's in the folder

```
22-rest-client/
├── server.js          the tiny API + a static file server (Node built-ins only)
├── package.json       npm start / npm run reset
├── data/
│   ├── seed.json      the starting data and the validation rules
│   └── db.json        created on first start; your changes are saved here
└── public/            the front end (what the browser loads)
    ├── index.html     the page, with two <template> stamps
    ├── styles.css
    ├── about.md       a plain text file the page fetches with response.text()
    └── js/
        ├── api.js     talks to the server: api(path, options) + listPlants, getPlant…
        ├── render.js  turns data into DOM: cards, detail, status, pager, form errors
        └── main.js    the state, the events, and the flow between the two
```

## The API

Open http://localhost:3000/api to see the routes as JSON.

| Method and path | Does | Success |
|---|---|---|
| `GET /api/plants?q=&category=&_sort=name&_page=1&_limit=5` | List, search, filter, page | `200` `{ items, total, page, limit, pages }` |
| `GET /api/plants/:id` | One plant | `200` the plant · `404` if no such id |
| `POST /api/plants` | Create (JSON body) | `201` the new plant, with its `id` |
| `PUT /api/plants/:id` | Replace the whole plant | `200` the saved plant |
| `PATCH /api/plants/:id` | Change only some fields | `200` the saved plant |
| `DELETE /api/plants/:id` | Delete | `204 No Content` (empty body) |
| `GET /api/categories` | The category list | `200` `{ items, ... }` |

Errors always come back as JSON with an `error` message:

- `400` validation: `{ "error": "Validation failed", "fields": { "price": "price must be a number (got \"12\")" } }`
- `400` the body isn't JSON (usually a missing `JSON.stringify`)
- `404` no such plant or route
- `415` the request forgot `Content-Type: application/json`

A plant: `{ "id": 1, "name": "Golden Barrel", "category": "cactus", "price": 24.99, "stock": 6, "favourite": true, "notes": "..." }`. `price` and `stock` must be **numbers**, not strings.

## Things to try in class

1. Open DevTools → **Network**, filter to **Fetch/XHR**, and reload. Click the `plants?...` request and look at Headers, Preview and Response.
2. Type in Search. Watch the requests: only one goes out when you pause (that's the debounce).
3. Click a plant (detail), then **Edit** and save (a `PUT`). Click **+ New plant** and leave the price empty: the server's `400` messages appear under the fields.
4. Click a star: it changes **straight away** (optimistic). Now open the Debug panel, tick "Make every save… fail", and click a star again: it flips back and shows an error (rollback).
5. Delete a plant: the page waits for the server's `204` before it changes (confirm-then-update).
6. Debug panel: click each button and read the status and response in the Network tab.
7. Look at the address bar after filtering: `?q=fern&category=fern`. Reload: your filters are still there.

### Seeing a CORS error on purpose

CORS only matters when the page and the API are on **different origins** (scheme + host + port).

1. Stop the server and run `CORS=off npm start`.
2. Open `public/index.html` with VS Code **Live Server** (it runs on port 5500, a different origin from the API on 3000).
3. The list fails. The Console says something like: *Access to fetch at 'http://localhost:3000/api/...' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.*
4. Restart with plain `npm start` and reload: it works. The fix for CORS is always on the **server**, never in your fetch code.

## Notes for AA03

This demo uses a different resource (plants) and a different layout (cards and a detail panel) from Assignment 3. The ideas carry over; the code does not. Assignment 3's front end runs with Vite; this one is served by its own small server so there is nothing to install.

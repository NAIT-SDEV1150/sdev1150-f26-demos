# API documentation for the Day 20 practice

This file documents two APIs, the way real API docs do. Read it like a manual: what URL, which method, what to send, what comes back, and what each status code means.

- **Part 1: Library API.** This one is real: it's the demo 18 server. Start it before the `.http` questions.
- **Part 2: Campus Events API.** Made up for question 23. You read it and write requests from it, but you can't send them.

---

## Part 1: Library API (demo 18)

**Start it:** in a terminal, `cd` into `18-http-json-rest`, then `npm install` and `npm start`. Leave the terminal open. Stop it with Ctrl+C. Restarting puts the data back to the start.

**Base URL:** `http://localhost:3001`

**Format:** requests and responses use JSON. Every response has a JSON body except **204** and **301**.

### The Book resource

| Field | Type | Notes |
|---|---|---|
| `id` | number | Made by the server. You can't set or change it. |
| `title` | string | Required, not empty |
| `author` | string | Required, not empty |
| `year` | number or `null` | A whole number. Default `null` |
| `available` | boolean | `true` = on the shelf, `false` = checked out. Default `true` |

```json
{ "id": 42, "title": "The Hitchhiker's Guide to the Galaxy", "author": "Douglas Adams", "year": 1979, "available": true }
```

On a fresh start there are 5 books with ids **1, 2, 3, 7 and 42**. New books get the next id: 43, 44, 45...

### Endpoints

#### `GET /api/books`
List books. Optional **query string** parameters:

| Parameter | Example | Meaning |
|---|---|---|
| `q` | `?q=atwood` | Only books whose title **or** author contains this text (not case sensitive) |
| `available` | `?available=false` | Only books with this `available` value (`true` or `false`) |

Combine them with `&`: `/api/books?q=the&available=true`. A space in a value is written `+` or `%20`.

- **200**: a JSON array of books (empty `[]` if nothing matches).

#### `GET /api/books/:id`
One book. `:id` is a placeholder: you write the number, as in `/api/books/42`.
- **200**: the book object
- **400**: the id isn't a whole number (`/api/books/abc`)
- **404**: no book has that id

#### `POST /api/books`
Create a book.
- **Headers:** `Content-Type: application/json` (required)
- **Body:** a JSON object with `title` and `author`; `year` and `available` are optional
- **201**: the new book (with its `id`), plus a `Location` header with its URL, like `/api/books/43`
- **400**: the body isn't valid JSON (`"error": "Invalid JSON in request body"`), or a field breaks the rules (`"error": "Validation failed"`, with the reasons in `details`)
- **415**: the `Content-Type` header is missing or isn't `application/json`

#### `PUT /api/books/:id`
**Replace** a book. Same headers and body rules as POST: `title` and `author` are required. Fields you leave out go back to their defaults.
- **200**: the updated book
- **400**, **415**: as for POST
- **404**: no book has that id

#### `PATCH /api/books/:id`
**Change some fields** of a book. Send only the fields you want to change (at least one).
- **200**: the updated book
- **400**: invalid JSON, a field breaks the rules, or no fields were sent
- **404**, **415**: as above

#### `DELETE /api/books/:id`
Remove a book.
- **204**: deleted. There is **no body**.
- **404**: no book has that id

#### Other routes
- `GET /api/health`: **200** `{ "status": "ok", "books": <count>, "time": "..." }`
- `GET /old-books`: **301**, with `Location: /api/books`
- `GET /api/broken`: always **500** (on purpose)
- A method a path doesn't support (like `DELETE /api/books`): **405**, with an `Allow` header
- Any other path: **404**

### Errors

Every error body has an `error` message. Some also have `details`:

```json
{ "error": "Validation failed", "details": ["title is required", "author is required"] }
```

---

## Part 2: Campus Events API (made up: read only)

**Base URL:** `https://events.example.com/v1`

**Authentication:** every request needs the header `X-Api-Key: <your key>`. Without it you get **401 Unauthorized**.

### The Event resource

```json
{ "id": 12, "title": "Intro to Web APIs", "category": "tech", "date": "2026-11-19T18:00:00-06:00", "seatsLeft": 0 }
```

`category` is one of `tech`, `arts` or `sports`.

### Endpoints

#### `GET /events`
| Parameter | Example | Meaning |
|---|---|---|
| `month` | `2026-11` | Only events in that month (format `YYYY-MM`) |
| `category` | `tech` | Only events in that category |
| `limit` | `5` | At most this many results (default 20) |

- **200**: `{ "data": [ ...events ], "total": <how many match> }`

#### `GET /events/:eventId`
- **200**: one event · **404**: no such event

#### `POST /events/:eventId/registrations`
Register for an event.
- **Headers:** `X-Api-Key`, `Content-Type: application/json`
- **Body:** `{ "name": "<string>", "email": "<string>" }` (both required)
- **201**: `{ "id": 88, "eventId": 12, "name": "...", "email": "...", "createdAt": "..." }`
- **400**: `name` or `email` missing · **404**: no such event · **409 Conflict**: the event is full (`seatsLeft` is 0)

#### `DELETE /registrations/:registrationId`
Cancel a registration.
- **204**: cancelled, no body · **404**: no such registration

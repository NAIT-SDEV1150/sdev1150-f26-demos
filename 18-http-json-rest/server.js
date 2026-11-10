// Demo 18: a small local JSON REST API (SDEV1150, Day 20)
//
// Run it:   npm start         (or: npm run dev  to restart when you save)
// Then open http://localhost:3001 in your browser.
//
// This file uses only Node's built-in modules, so there is nothing to install.
// It is a SERVER: it waits for HTTP requests and sends back HTTP responses.
// The browser (or the REST Client in VS Code) is the CLIENT.
//
// The data lives in memory. It starts as a copy of books.json, and every
// restart puts it back the way it was. Nothing you POST or DELETE is saved.

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(HERE, 'public');
const PORT = Number(process.env.PORT) || 3001;

// ---------------------------------------------------------------------------
// 1. The data: an array of book objects, loaded from books.json at start-up
// ---------------------------------------------------------------------------
const books = JSON.parse(await readFile(path.join(HERE, 'books.json'), 'utf8'));
let nextId = Math.max(...books.map((book) => book.id)) + 1;

// ---------------------------------------------------------------------------
// 2. Small helpers
// ---------------------------------------------------------------------------

// Send a JSON response: status line + headers + body
const sendJson = (res, status, data, extraHeaders = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders });
  res.end(JSON.stringify(data, null, 2));
};

// Send a response with NO body (used for 204 No Content and 301 redirects)
const sendEmpty = (res, status, extraHeaders = {}) => {
  res.writeHead(status, extraHeaders);
  res.end();
};

// Read the whole request body as text (it arrives in chunks)
const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

// Check the fields of a book. Returns an array of messages ([] means "all good").
// partial = true is for PATCH: only the fields that were sent are checked.
const checkBook = (data, partial) => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return ['The body must be a JSON object, like { "title": "..." }'];
  }
  const errors = [];
  for (const field of ['title', 'author']) {
    const missing = !(field in data);
    if (missing && !partial) errors.push(`${field} is required`);
    if (!missing && (typeof data[field] !== 'string' || data[field].trim() === '')) {
      errors.push(`${field} must be a non-empty string`);
    }
  }
  if ('year' in data && data.year !== null && !Number.isInteger(data.year)) {
    errors.push('year must be a whole number (or null)');
  }
  if ('available' in data && typeof data.available !== 'boolean') {
    errors.push('available must be true or false');
  }
  return errors;
};

// Build a full book in a fixed order: id, title, author, year, available.
// Fields that were not sent get their defaults (year: null, available: true).
const makeBook = (id, fields) => ({
  id,
  title: fields.title,
  author: fields.author,
  year: fields.year ?? null,
  available: fields.available ?? true,
});

// Keep only the fields a book is allowed to have (the server ignores anything else)
const pickFields = (data) => {
  const result = {};
  for (const field of ['title', 'author', 'year', 'available']) {
    if (field in data) result[field] = typeof data[field] === 'string' ? data[field].trim() : data[field];
  }
  return result;
};

// For POST, PUT and PATCH: check the Content-Type, read the body, parse the JSON.
// Returns the parsed value, or null after it has already sent an error response.
const readJsonBody = async (req, res) => {
  const type = req.headers['content-type'] || '';
  if (!type.includes('application/json')) {
    sendJson(res, 415, { error: 'Content-Type must be application/json' });
    return null;
  }
  const text = await readBody(req);
  try {
    return JSON.parse(text);
  } catch (err) {
    sendJson(res, 400, { error: 'Invalid JSON in request body', details: [err.message] });
    return null;
  }
};

// Serve a file from the public/ folder (the web pages for this demo)
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };
const serveStatic = async (res, pathname) => {
  const file = path.normalize(path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname));
  if (!file.startsWith(PUBLIC_DIR)) return false;
  try {
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': `${TYPES[path.extname(file)] || 'text/plain'}; charset=utf-8` });
    res.end(content);
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// 3. The routes: one function per "method + path" pair
// ---------------------------------------------------------------------------

// GET /api/books            -> every book
// GET /api/books?q=the      -> books whose title or author contains "the"
// GET /api/books?available=true
const listBooks = (res, query) => {
  let result = books;
  const q = query.get('q');
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((book) =>
      book.title.toLowerCase().includes(needle) || book.author.toLowerCase().includes(needle));
  }
  const available = query.get('available');
  if (available === 'true' || available === 'false') {
    result = result.filter((book) => book.available === (available === 'true'));
  }
  sendJson(res, 200, result);
};

// POST /api/books  -> create a new book (201 Created)
const createBook = async (req, res) => {
  const data = await readJsonBody(req, res);
  if (data === null) return;
  const errors = checkBook(data, false);
  if (errors.length > 0) return sendJson(res, 400, { error: 'Validation failed', details: errors });

  const book = makeBook(nextId, pickFields(data));
  nextId += 1;
  books.push(book);
  sendJson(res, 201, book, { Location: `/api/books/${book.id}` });
};

// PUT /api/books/:id  -> REPLACE the whole book (fields you leave out go back to defaults)
const replaceBook = async (req, res, index) => {
  const data = await readJsonBody(req, res);
  if (data === null) return;
  const errors = checkBook(data, false);
  if (errors.length > 0) return sendJson(res, 400, { error: 'Validation failed', details: errors });

  books[index] = makeBook(books[index].id, pickFields(data));
  sendJson(res, 200, books[index]);
};

// PATCH /api/books/:id  -> change only the fields you send
const updateBook = async (req, res, index) => {
  const data = await readJsonBody(req, res);
  if (data === null) return;
  const errors = checkBook(data, true);
  if (errors.length > 0) return sendJson(res, 400, { error: 'Validation failed', details: errors });

  const changes = pickFields(data);
  if (Object.keys(changes).length === 0) {
    return sendJson(res, 400, { error: 'Nothing to update: send at least one of title, author, year, available' });
  }
  books[index] = { ...books[index], ...changes };
  sendJson(res, 200, books[index]);
};

// DELETE /api/books/:id  -> remove it (204 No Content: success, and no body)
const deleteBook = (res, index) => {
  books.splice(index, 1);
  sendEmpty(res, 204);
};

// ---------------------------------------------------------------------------
// 4. The server: look at the method and the path, then pick a route
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const { pathname, searchParams } = url;
  const method = req.method;

  // Print one line per request in the terminal, with the status we sent back
  res.on('finish', () => console.log(`${method} ${url.pathname}${url.search} -> ${res.statusCode}`));

  // Let pages from other ports (for example Vite on 5173) call this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') return sendEmpty(res, 204);

  try {
    // --- the collection: /api/books ---
    if (pathname === '/api/books') {
      if (method === 'GET') return listBooks(res, searchParams);
      if (method === 'POST') return await createBook(req, res);
      return sendJson(res, 405, { error: `${method} is not allowed on /api/books` }, { Allow: 'GET, POST' });
    }

    // --- one item: /api/books/42 ---
    const match = pathname.match(/^\/api\/books\/([^/]+)$/);
    if (match) {
      const allowed = 'GET, PUT, PATCH, DELETE';
      if (!allowed.split(', ').includes(method)) {
        return sendJson(res, 405, { error: `${method} is not allowed on ${pathname}` }, { Allow: allowed });
      }
      if (!/^\d+$/.test(match[1])) {
        return sendJson(res, 400, { error: `"${match[1]}" is not a valid id: ids are whole numbers` });
      }
      const id = Number(match[1]);
      const index = books.findIndex((book) => book.id === id);
      if (index === -1) return sendJson(res, 404, { error: `No book with id ${id}` });

      if (method === 'GET') return sendJson(res, 200, books[index]);
      if (method === 'PUT') return await replaceBook(req, res, index);
      if (method === 'PATCH') return await updateBook(req, res, index);
      return deleteBook(res, index);
    }

    // --- extras for teaching ---
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, { status: 'ok', books: books.length, time: new Date().toISOString() });
    }
    if (pathname === '/old-books' && method === 'GET') {
      return sendEmpty(res, 301, { Location: '/api/books' }); // "moved permanently: go here instead"
    }
    if (pathname === '/api/broken') {
      throw new Error('This route breaks on purpose to show a 500');
    }

    // --- the web pages in public/ ---
    if (method === 'GET' && !pathname.startsWith('/api/') && await serveStatic(res, pathname)) return;

    sendJson(res, 404, { error: `Nothing here: ${method} ${pathname}` });
  } catch (err) {
    console.error('Server error:', err.message);
    sendJson(res, 500, { error: 'Something went wrong on the server' });
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other server, or run: PORT=3002 npm start`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Books API running at http://localhost:${PORT}`);
  console.log(`Try http://localhost:${PORT}/api/books   (press Ctrl+C to stop)`);
});

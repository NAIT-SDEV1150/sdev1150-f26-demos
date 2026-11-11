// Demo 20: a tiny local server for the fetch demo.
// No packages to install. Run it with:   npm start   (or: node server.js)
// Then open http://localhost:3020
//
// It does two jobs:
//   1. Serves the files in this folder (index.html, main.js, data/*.json ...)
//      exactly like Live Server does.
//   2. Adds a small JSON API, so we can try query strings and POST:
//        GET  /api/menu?q=latte&category=drink   -> matching menu items
//        GET  /api/orders                        -> every order so far
//        POST /api/orders  { "menuId": 2, "quantity": 1 }  -> 201 + the new order
//      Add &delay=1500 to any /api URL to make it slow on purpose.
//
// You don't need to understand this file today. It is the "kitchen";
// main.js is the "customer" that we study.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 3020;
const ROOT = fileURLToPath(new URL('.', import.meta.url));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const menu = JSON.parse(await readFile(join(ROOT, 'data', 'menu.json'), 'utf8'));
const orders = [];
let nextOrderId = 1;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': TYPES['.json'] });
  res.end(JSON.stringify(body, null, 2));
}

async function readBody(req) {
  let text = '';
  for await (const chunk of req) text += chunk;
  return text;
}

async function handleApi(req, res, url) {
  const delay = Math.min(Number(url.searchParams.get('delay')) || 0, 5000);
  if (delay) await wait(delay);

  if (url.pathname === '/api/menu' && req.method === 'GET') {
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const category = url.searchParams.get('category') || '';
    const items = menu.filter((item) =>
      item.name.toLowerCase().includes(q) && (category === '' || item.category === category));
    return sendJson(res, 200, items);
  }

  if (url.pathname === '/api/orders' && req.method === 'GET') {
    return sendJson(res, 200, orders);
  }

  if (url.pathname === '/api/orders' && req.method === 'POST') {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return sendJson(res, 400, { error: 'The body was not valid JSON.' });
    }
    const item = menu.find((m) => m.id === Number(data.menuId));
    const quantity = Number(data.quantity);
    if (!item) return sendJson(res, 400, { error: 'Unknown menuId.' });
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return sendJson(res, 400, { error: 'quantity must be a whole number from 1 to 10.' });
    }
    const order = {
      id: nextOrderId++,
      menuId: item.id,
      name: item.name,
      quantity,
      total: Math.round(item.price * quantity * 100) / 100,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return sendJson(res, 201, order);
  }

  return sendJson(res, 404, { error: `No API route for ${req.method} ${url.pathname}` });
}

async function handleFile(req, res, url) {
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith('/')) path += 'index.html';
  const filePath = normalize(join(ROOT, path));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><title>404</title><h1>404 Not Found</h1>');
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(req.method, url.pathname + url.search);
  try {
    if (url.pathname.startsWith('/api/')) await handleApi(req, res, url);
    else await handleFile(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: 'Something broke on the server.' });
  }
}).listen(PORT, () => {
  console.log(`Demo 20 running at http://localhost:${PORT}  (Ctrl+C to stop)`);
});

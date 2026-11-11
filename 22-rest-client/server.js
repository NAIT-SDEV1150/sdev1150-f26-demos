// server.js: a tiny REST API + static file server for SDEV1150 demos.
//
// No packages needed: it only uses what comes with Node.js.
//   npm start            -> http://localhost:3000  (API under /api)
//   npm run reset        -> put the data back to how it started
//   DELAY=0 npm start    -> no fake network delay
//   CORS=off npm start   -> turn CORS headers off (to see a CORS error on purpose)
//
// The resources (and their rules) come from data/seed.json.
// Changes are saved to data/db.json, so they survive a restart.

import http from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const DELAY = Number(process.env.DELAY ?? 300); // ms, so loading states are visible
const CORS_ON = process.env.CORS !== 'off';
const SEED_FILE = path.join(HERE, 'data', 'seed.json');
const DB_FILE = path.join(HERE, 'data', 'db.json');
const STATIC_DIR = existsSync(path.join(HERE, 'public')) ? path.join(HERE, 'public') : HERE;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// ---------- data ----------

if (process.argv.includes('--reset')) {
  await copyFile(SEED_FILE, DB_FILE);
  console.log('Data reset: data/db.json now matches data/seed.json');
  process.exit(0);
}
if (!existsSync(DB_FILE)) await copyFile(SEED_FILE, DB_FILE);

const db = JSON.parse(await readFile(DB_FILE, 'utf8'));
const schema = db.schema ?? {};

async function save() {
  await writeFile(DB_FILE, JSON.stringify(db, null, 2) + '\n');
}

// ---------- validation ----------

// Checks one record against the rules in seed.json -> schema.
// partial = true is for PATCH: only check the fields that were sent.
function validate(resource, input, partial) {
  const rules = schema[resource] ?? {};
  const clean = {};
  const fields = {};

  for (const [field, rule] of Object.entries(rules)) {
    let value = input[field];
    const missing = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

    if (missing) {
      if (partial) continue;
      if (rule.required) { fields[field] = `${field} is required`; continue; }
      if ('default' in rule) clean[field] = rule.default;
      continue;
    }

    if (rule.type === 'string') {
      if (typeof value !== 'string') { fields[field] = `${field} must be text`; continue; }
      value = value.trim();
      if (rule.minLength && value.length < rule.minLength) { fields[field] = `${field} must be at least ${rule.minLength} characters`; continue; }
      if (rule.maxLength && value.length > rule.maxLength) { fields[field] = `${field} must be at most ${rule.maxLength} characters`; continue; }
    }
    if (rule.type === 'number' || rule.type === 'integer') {
      if (typeof value !== 'number' || !Number.isFinite(value)) { fields[field] = `${field} must be a number (got ${JSON.stringify(value)})`; continue; }
      if (rule.type === 'integer' && !Number.isInteger(value)) { fields[field] = `${field} must be a whole number`; continue; }
      if ('min' in rule && value < rule.min) { fields[field] = `${field} must be ${rule.min} or more`; continue; }
      if ('max' in rule && value > rule.max) { fields[field] = `${field} must be ${rule.max} or less`; continue; }
    }
    if (rule.type === 'boolean' && typeof value !== 'boolean') { fields[field] = `${field} must be true or false`; continue; }
    if (rule.oneOf && !rule.oneOf.includes(value)) { fields[field] = `${field} must be one of: ${rule.oneOf.join(', ')}`; continue; }

    clean[field] = value;
  }
  return { clean, fields, ok: Object.keys(fields).length === 0 };
}

// ---------- helpers ----------

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function send(res, status, data, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (data !== undefined) headers['Content-Type'] = 'application/json; charset=utf-8';
  res.writeHead(status, headers);
  res.end(data === undefined ? undefined : JSON.stringify(data, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// GET /api/<resource>?q=&<field>=&_sort=&_order=&_page=&_limit=
function listItems(resource, params) {
  let items = [...db[resource]];
  const rules = schema[resource] ?? {};

  for (const [key, value] of params) {
    if (key.startsWith('_') || key === 'q') continue;
    if (!(key in rules) && key !== 'id') {
      return { error: `Unknown filter "${key}". You can filter by: ${['id', ...Object.keys(rules)].join(', ')}` };
    }
    items = items.filter((item) => String(item[key]) === value);
  }

  const q = (params.get('q') ?? '').trim().toLowerCase();
  if (q) {
    items = items.filter((item) =>
      Object.values(item).some((v) => typeof v === 'string' && v.toLowerCase().includes(q)));
  }

  const sort = params.get('_sort');
  if (sort) {
    const dir = params.get('_order') === 'desc' ? -1 : 1;
    items.sort((a, b) => (a[sort] > b[sort] ? dir : a[sort] < b[sort] ? -dir : 0));
  }

  const total = items.length;
  const pageParam = params.get('_page');
  const limitParam = params.get('_limit');
  if (pageParam === null && limitParam === null) {
    return { items, total, page: 1, limit: total, pages: 1 };
  }
  const limit = Math.max(1, Number(limitParam) || 10);
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.max(1, Number(pageParam) || 1);
  return { items: items.slice((page - 1) * limit, page * limit), total, page, limit, pages };
}

// ---------- the API ----------

async function handleApi(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean); // ['api', 'plants', '3']
  const [, resource, idText, extra] = parts;
  const method = req.method;

  // Teaching switch: make a request fail on purpose with a header.
  const simulate = Number(req.headers['x-simulate-error']);
  if (simulate >= 400 && simulate <= 599) {
    return send(res, simulate, { error: `Simulated ${simulate} error (you asked for it with X-Simulate-Error)` });
  }

  if (!resource) {
    const resources = Object.keys(db).filter((key) => key !== 'schema');
    return send(res, 200, {
      message: 'Welcome to the demo API. Read the routes below like API docs.',
      resources,
      routes: [
        'GET    /api/<resource>?q=&<field>=&_sort=&_order=asc|desc&_page=&_limit=',
        'GET    /api/<resource>/<id>',
        'POST   /api/<resource>        (JSON body)  -> 201 + the new record',
        'PUT    /api/<resource>/<id>   (JSON body)  -> 200 + the replaced record',
        'PATCH  /api/<resource>/<id>   (JSON body)  -> 200 + the updated record',
        'DELETE /api/<resource>/<id>                -> 204 No Content',
      ],
      listShape: '{ items, total, page, limit, pages }',
      rules: schema,
    });
  }

  if (!Array.isArray(db[resource]) || resource === 'schema' || extra !== undefined) {
    return send(res, 404, { error: `No such route: ${method} ${url.pathname}` });
  }

  const items = db[resource];
  const id = idText === undefined ? null : Number(idText);
  if (idText !== undefined && !Number.isInteger(id)) {
    return send(res, 404, { error: `"${idText}" is not a valid ${resource} id (ids are numbers)` });
  }
  const index = id === null ? -1 : items.findIndex((item) => item.id === id);
  if (id !== null && index === -1) {
    return send(res, 404, { error: `${resource} ${id} not found` });
  }

  // Requests that send data must say it is JSON, and must actually be JSON.
  let input = null;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const type = req.headers['content-type'] ?? '';
    const raw = await readBody(req);
    if (!type.includes('application/json')) {
      return send(res, 415, {
        error: 'Content-Type must be application/json',
        received: type || '(no Content-Type header)',
        hint: "Add headers: { 'Content-Type': 'application/json' } to your fetch options",
      });
    }
    try {
      input = JSON.parse(raw);
    } catch {
      return send(res, 400, {
        error: 'Body is not valid JSON',
        received: raw.slice(0, 60),
        hint: 'Did you forget JSON.stringify(...) on the body?',
      });
    }
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
      return send(res, 400, { error: 'Body must be a JSON object like { "name": "..." }' });
    }
  }

  if (method === 'GET' && id === null) {
    const result = listItems(resource, url.searchParams);
    if (result.error) return send(res, 400, { error: result.error });
    return send(res, 200, result);
  }
  if (method === 'GET') return send(res, 200, items[index]);

  if (method === 'POST' && id === null) {
    const { clean, fields, ok } = validate(resource, input, false);
    if (!ok) return send(res, 400, { error: 'Validation failed', fields });
    const record = { id: nextId(items), ...clean };
    items.push(record);
    await save();
    return send(res, 201, record, { Location: `/api/${resource}/${record.id}` });
  }

  if ((method === 'PUT' || method === 'PATCH') && id !== null) {
    const partial = method === 'PATCH';
    const { clean, fields, ok } = validate(resource, input, partial);
    if (!ok) return send(res, 400, { error: 'Validation failed', fields });
    items[index] = partial ? { ...items[index], ...clean, id } : { id, ...clean };
    await save();
    return send(res, 200, items[index]);
  }

  if (method === 'DELETE' && id !== null) {
    items.splice(index, 1);
    await save();
    return send(res, 204);
  }

  return send(res, 405, { error: `${method} is not allowed on ${url.pathname}` });
}

// ---------- static files (the front end) ----------

async function handleStatic(req, res, url) {
  let filePath = path.normalize(path.join(STATIC_DIR, decodeURIComponent(url.pathname)));
  if (!filePath.startsWith(STATIC_DIR)) return send(res, 403, { error: 'Forbidden' });
  if (url.pathname.endsWith('/')) filePath = path.join(filePath, 'index.html');
  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404: ${url.pathname} is not a file in this folder`);
  }
}

// ---------- the server ----------

const server = http.createServer(async (req, res) => {
  const started = Date.now();
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  res.on('finish', () => {
    console.log(`${req.method.padEnd(7)} ${url.pathname}${url.search} -> ${res.statusCode} (${Date.now() - started} ms)`);
  });

  if (CORS_ON) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Simulate-Error');
    res.setHeader('Access-Control-Expose-Headers', 'Location');
  }
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  try {
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const delay = url.searchParams.has('_delay') ? Number(url.searchParams.get('_delay')) : DELAY;
      if (delay > 0) await wait(Math.min(delay, 10000));
      await handleApi(req, res, url);
    } else {
      await handleStatic(req, res, url);
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) send(res, 500, { error: 'Something broke on the server. Check the terminal.' });
  }
});

server.listen(PORT, () => {
  console.log(`Demo API and front end: http://localhost:${PORT}`);
  console.log(`API docs (JSON):        http://localhost:${PORT}/api`);
  console.log(`Delay: ${DELAY} ms · CORS: ${CORS_ON ? 'on' : 'OFF'} · Data: data/db.json (npm run reset to restore)`);
  console.log('Press Ctrl+C to stop.');
});

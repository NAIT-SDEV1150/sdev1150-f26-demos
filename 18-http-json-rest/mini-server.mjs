// The smallest useful JSON API: two GET routes, about 20 lines.
// Run: node mini-server.mjs   then open http://localhost:3002/api/books
// (server.js is the full version with POST, PUT, PATCH and DELETE.)

import http from 'node:http';

const books = [
  { id: 1, title: 'The Hobbit' },
  { id: 42, title: "The Hitchhiker's Guide to the Galaxy" },
];

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && pathname === '/api/books') {
    res.statusCode = 200;
    res.end(JSON.stringify(books));
  } else if (req.method === 'GET' && pathname.startsWith('/api/books/')) {
    const id = Number(pathname.split('/')[3]);
    const book = books.find((b) => b.id === id);
    res.statusCode = book ? 200 : 404;
    res.end(JSON.stringify(book ?? { error: `No book with id ${id}` }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3002, () => console.log('Mini API at http://localhost:3002/api/books'));

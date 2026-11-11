# About the Kaktus Plant Shop API

This file is plain Markdown text. The page loaded it with:

    const response = await fetch('about.md');
    const text = await response.text();   // not .json()

fetch can load any kind of file: JSON, text, Markdown, images, even JavaScript.
The method you call on the response decides how the body is read:

- response.json()  -> a JavaScript object or array (the body must be JSON)
- response.text()  -> a string, exactly as the server sent it
- response.blob()  -> raw bytes, for images and downloads

Want it to look like a real page? A Markdown library such as markdown-it can turn
this text into HTML. That is a nice extra to try at home; this demo just shows the
raw text so you can see exactly what arrived.

## Routes

- GET    /api/plants?q=&category=&_sort=name&_page=1&_limit=5
- GET    /api/plants/:id
- POST   /api/plants          (JSON body)
- PUT    /api/plants/:id      (JSON body, the whole plant)
- PATCH  /api/plants/:id      (JSON body, only the fields that change)
- DELETE /api/plants/:id      (204 No Content)
- GET    /api/categories

# Day 21 practice: walkthrough and answers

Try each question on your own first. Then come here to check.

Every answer below was tested in a real browser against `index.html`, served with `python3 -m http.server`. You can paste all of them into one `main.js`, one after the other (Q11's `getJSON` is used by later answers, and Q13 uses the `wait` helper from the top of `QUESTIONS.md`).

Each question has four parts:
- **Answer:** the code
- **Step by step:** what to look for and what each line does
- **What you'll see**
- **Common mistake**

Two words you'll see a lot:
- **Promise:** an object that stands for a result that isn't ready yet. It is *pending*, then either *fulfilled* (it worked, here's the value) or *rejected* (it failed, here's the error). Like a restaurant pager.
- **Response:** what `fetch` gives you when the server answers. It has `status`, `ok` and methods like `.json()` and `.text()` to read the body.

---

## Tier 1: Simple

### Q1. Show the status code

```js
fetch('data/message.json').then((response) => {
  document.querySelector('#q1-out').textContent = response.status;
});
```

**Step by step**
1. `fetch('data/message.json')` asks the server for that file. It does **not** wait. It hands you a Promise straight away.
2. `.then(...)` says "when the Promise is fulfilled, run this function". The function receives the **Response**.
3. `response.status` is the HTTP status code the server sent: `200` means OK.

**What you'll see:** `200` in the page. In the Network tab, a row for `message.json` with status 200.

**Common mistake:** `const response = fetch(...); console.log(response.status);`. That logs `undefined`, because `fetch` returns a *Promise*, not the Response. You have to wait for it with `.then` or `await`.

### Q2. Show the message (a `.then` chain)

```js
fetch('data/message.json')
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#q2-out').textContent = data.message;
  });
```

**Step by step**
1. The first `.then` gets the Response and calls `response.json()`. That reads the body and turns the JSON text into a JavaScript object. It **also** takes time, so it returns another Promise.
2. Because the arrow function *returns* that Promise, the next `.then` waits for it.
3. The second `.then` receives the finished object, `{ message: "Hello from a JSON file!" }`, and shows `data.message`.

**What you'll see:** `Hello from a JSON file!`

**Common mistake:** using curly braces without `return`: `.then((response) => { response.json(); })`. The braces make it a normal function body, so nothing is returned, and the next `.then` gets `undefined`. Then `data.message` crashes with "Cannot read properties of undefined".

### Q3. The same idea with `async`/`await`

```js
async function loadTip() {
  const response = await fetch('data/tip.json');
  const tip = await response.json();
  document.querySelector('#q3-out').textContent = tip.text;
}
loadTip();
```

**Step by step**
1. `async` in front of `function` lets you use `await` inside it.
2. `await fetch(...)` pauses **this function only** until the Response arrives. The rest of the page keeps running.
3. `await response.json()` pauses again until the body is parsed.
4. Now `tip` is a normal object and you use `tip.text`.
5. Don't forget to **call** `loadTip()`. Defining a function doesn't run it.

**What you'll see:** `Keep the Network tab open while you work.`

**Common mistake:** forgetting the second `await`: `const tip = response.json();`. Then `tip` is a Promise, and `tip.text` is `undefined`.

### Q4. A missing file

```js
fetch('data/does-not-exist.json').then((response) => {
  document.querySelector('#q4-out').textContent = `ok: ${response.ok}, status: ${response.status}`;
});
```

**Step by step**
1. The file doesn't exist, so the server answers `404 Not Found`.
2. **The server still answered.** That means `fetch`'s Promise is **fulfilled**, and `.then` runs.
3. `response.ok` is `true` only for statuses 200-299. Here it's `false`, and `status` is `404`.

**What you'll see:** `ok: false, status: 404`. In the Network tab the row is red.

**Common mistake:** expecting `fetch` to fail (reject) on a 404. It doesn't. `fetch` only rejects when there's **no answer at all** (no network, bad address). You must check `response.ok` yourself. This is the most important idea of the day.

### Q5. Read a text file

```js
fetch('data/notes.txt')
  .then((response) => response.text())
  .then((text) => {
    document.querySelector('#q5-out').textContent = text;
  });
```

**Step by step**
1. A `.txt` file is plain text, not JSON, so use `response.text()` instead of `response.json()`.
2. `.text()` also returns a Promise; the next `.then` gets the whole file as one string.
3. `#q5-out` is a `<pre>`, which keeps the line breaks.

**What you'll see:** the three lines of ranger station hours.

**Common mistake:** calling `.json()` on text. You'll get `SyntaxError: Unexpected token 'R', "Ranger sta"... is not valid JSON`. Pick the reader that matches the file: `.json()` for JSON, `.text()` for anything else that is text (Markdown, CSV, HTML).

---

## Tier 2: Easy

### Q6. Count the parks

```js
async function countParks() {
  const response = await fetch('data/parks.json');
  const parks = await response.json();
  document.querySelector('#q6-out').textContent = `There are ${parks.length} parks.`;
}
countParks();
```

**Step by step**
1. Open `data/parks.json` first. It starts with `[`, so after parsing it's an **array**.
2. Arrays have `.length`, so `parks.length` is `5`.
3. A template literal drops the number into the sentence.

**What you'll see:** `There are 5 parks.`

**Common mistake:** using the variable outside the function: `countParks(); console.log(parks.length);`. `parks` only exists inside the function, and even if it didn't, that line runs **before** the data arrives. Put the code that needs the data after the `await`, inside the function.

### Q7. List the park names

```js
async function listParkNames() {
  const response = await fetch('data/parks.json');
  const parks = await response.json();
  const list = document.querySelector('#q7-list');
  parks.forEach((park) => {
    const li = document.createElement('li');
    li.textContent = park.name;
    list.append(li);
  });
}
listParkNames();
```

**Step by step**
1. Load and parse as before.
2. For each park object, make an `<li>`, put **only the name** in it, and append it to the list.
3. This is the same create-fill-append pattern from the to-do list (demo 03). The only new part is where the data came from.

**What you'll see:** Banff, Jasper, Elk Island, Pacific Rim, Yoho as bullet points.

**Common mistake:** `li.textContent = park;`. You'll see `[object Object]` five times, because `park` is a whole object. Pick the property you want: `park.name`.

### Q8. The order test

```js
document.querySelector('#q8-btn').addEventListener('click', () => {
  const out = document.querySelector('#q8-out');
  out.textContent = 'A';
  fetch('data/message.json').then(() => {
    out.textContent += ' C';
  });
  out.textContent += ' B';
});
```

**Step by step**
1. `A` is set right away.
2. `fetch` **starts** the request and immediately returns a Promise. The `.then` function is saved for later: it is the pager.
3. JavaScript does **not** stop. It moves to the next line and adds ` B`.
4. Some milliseconds later the response arrives, the Promise is fulfilled, and the saved function adds ` C`.

**What you'll see:** `A B C`. If you could freeze time just after the click, you'd see `A B`.

**Common mistake:** thinking code runs "in the order it's written" when promises are involved. Code inside `.then` (or after an `await`) runs **later**, after the code below it has finished.

### Q9. Fetch on a click

```js
document.querySelector('#q9-btn').addEventListener('click', async () => {
  const response = await fetch('data/fact.json');
  const fact = await response.json();
  document.querySelector('#q9-out').textContent = fact.text;
});
```

**Step by step**
1. The `fetch` is **inside** the click handler, so nothing is requested until you click.
2. To use `await` inside the handler, the arrow function itself must be `async`: `async () => { ... }`.
3. Load, parse, show.

**What you'll see:** the fact about Banff after you click. In the Network tab, a new `fact.json` row appears on **every** click.

**Common mistake:** writing `await` inside a handler that isn't `async`. The browser stops with `SyntaxError: await is only valid in async functions and the top level bodies of modules`.

### Q10. A real network failure

```js
fetch('https://no-such-host.invalid/parks.json')
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#q10-out').textContent = `Got ${data.length} parks`;
  })
  .catch((error) => {
    document.querySelector('#q10-out').textContent = `Network error: ${error.message}`;
  });
```

**Step by step**
1. `.invalid` is a domain name reserved so it can never exist. No server can answer.
2. With **no answer at all**, `fetch`'s Promise is **rejected** with a `TypeError`.
3. A rejection skips every `.then` and jumps to the first `.catch`.
4. `error.message` is the browser's wording: Chrome and Edge say `Failed to fetch`, Firefox says `NetworkError when attempting to fetch resource.`

**What you'll see:** `Network error: Failed to fetch` (in Edge or Chrome). The Network tab shows the request as failed, with no status.

**Common mistake:** leaving off `.catch`. The page shows nothing and the Console shows `Uncaught (in promise) TypeError: Failed to fetch`. "Uncaught (in promise)" always means "you didn't handle a rejection".

---

## Tier 3: Competent

### Q11. A reusable `getJSON` helper

```js
async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function showSiteName() {
  const config = await getJSON('data/config.json');
  document.querySelector('#q11-out').textContent = `Welcome to ${config.siteName}`;
}
showSiteName();
```

**Step by step**
1. `getJSON` does the three steps every JSON request needs: fetch, **check `ok`**, parse.
2. `throw new Error(...)` turns a 404 or 500 into a real failure. Because the function is `async`, throwing makes its Promise **reject**, so a `catch` around the caller will see it.
3. `return response.json()` hands back the parsed data (an `async` function always wraps what it returns in a Promise, so callers `await getJSON(...)`).
4. `showSiteName` now needs one line to load data.

**What you'll see:** `Welcome to Park Finder`

**Common mistake:** checking `response.ok` **after** calling `.json()`. On a 404 the body is usually an HTML error page, so `.json()` throws a confusing `Unexpected token '<'` before your check runs. Check first, parse second.

### Q12. Catch the 404 and tell the user

```js
async function loadMissing() {
  const out = document.querySelector('#q12-out');
  try {
    const data = await getJSON('data/missing.json');
    out.textContent = `Loaded ${data.length} items`;
  } catch (error) {
    out.textContent = `Could not load: ${error.message}`;
    out.classList.add('error');
  }
}
loadMissing();
```

**Step by step**
1. `try { ... }` holds the code that might fail.
2. `getJSON` sees `ok: false` and throws `Error('HTTP 404')`.
3. The rest of the `try` is skipped and `catch (error)` runs with that error.
4. Show its message and add the `error` class (red text from `styles.css`).

**What you'll see:** `Could not load: HTTP 404` in red.

**Common mistake:** putting `try`/`catch` around a call **without** `await`: `try { getJSON(url); } catch {...}`. Without `await`, the function returns its Promise instantly, the `try` finishes, and the later rejection is never caught.

### Q13. Loading state and a disabled button

```js
const q13Button = document.querySelector('#q13-btn');
const q13Status = document.querySelector('#q13-status');

q13Button.addEventListener('click', async () => {
  q13Button.disabled = true;
  q13Status.className = 'status loading';
  q13Status.textContent = 'Loading…';
  try {
    await wait(800);
    const parks = await getJSON('data/parks.json');
    q13Status.className = 'status ok';
    q13Status.textContent = `Loaded ${parks.length} parks.`;
  } catch (error) {
    q13Status.className = 'status error';
    q13Status.textContent = `Could not load parks (${error.message}).`;
  } finally {
    q13Button.disabled = false;
  }
});
```

**Step by step**
1. **Before** waiting: disable the button (no double clicks) and say `Loading…`. The user must always know something is happening.
2. `await wait(800)` fakes a slow network so you can actually see the loading state. (You can also use the Network tab's throttling menu: *Slow 4G*.)
3. Success: show the count with class `ok`.
4. Failure: show a message with class `error`.
5. `finally` runs **after either one**. That's where the button comes back on.

**What you'll see:** the button greys out and `Loading…` shows for about a second, then `Loaded 5 parks.` in green.

**Common mistake:** re-enabling the button only at the end of the `try`. If the request fails, that line never runs and the button stays disabled forever. `finally` is made for this.

### Q14. Fetch on form submit

```js
document.querySelector('#q14-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const province = document.querySelector('#q14-province').value;
  const status = document.querySelector('#q14-status');
  const list = document.querySelector('#q14-list');
  list.replaceChildren();
  try {
    const parks = await getJSON('data/parks.json');
    const matches = parks.filter((park) => park.province === province);
    if (matches.length === 0) {
      status.className = 'status empty';
      status.textContent = `No parks found in ${province}.`;
      return;
    }
    matches.forEach((park) => {
      const li = document.createElement('li');
      li.textContent = park.name;
      list.append(li);
    });
    status.className = 'status ok';
    status.textContent = `${matches.length} parks in ${province}.`;
  } catch (error) {
    status.className = 'status error';
    status.textContent = `Search failed (${error.message}).`;
  }
});
```

**Step by step**
1. Listen for `submit` on the **form** (it catches the button and the Enter key), and call `event.preventDefault()` so the page doesn't reload.
2. Read the choice **inside** the handler, so you get the current value.
3. `replaceChildren()` with nothing empties the old list.
4. Load, then `filter` to the matching province.
5. **Empty is not an error**: the request worked, there's just nothing to show. Give it its own message and class.

**What you'll see:** `3 parks in AB.` with Banff, Jasper, Elk Island. Pick Saskatchewan: `No parks found in SK.` in grey.

**Common mistake:** forgetting `preventDefault()`. The page reloads, the request is cancelled half-way (you'll see it marked *cancelled* in the Network tab), and the list never appears.

### Q15. Build a query string with `URLSearchParams`

```js
async function queryStringDemo() {
  const params = new URLSearchParams({ q: 'lake louise', page: 2, sort: 'name' });
  const url = `data/parks.json?${params}`;
  document.querySelector('#q15-out').textContent = url;
  const response = await fetch(url);
  document.querySelector('#q15-status').textContent = `Status: ${response.status}`;
}
queryStringDemo();
```

**Step by step**
1. A **query string** is the part of a URL after `?`: `name=value` pairs joined by `&`. APIs use it for searches, filters and page numbers.
2. `new URLSearchParams({...})` builds it for you and **encodes** awkward characters: the space in `lake louise` becomes `+`.
3. Putting `params` in a template literal turns it into the string `q=lake+louise&page=2&sort=name`.
4. Fetch the full URL. A file server ignores the query and sends the file, so you get `200`. A real API would use it to filter.

**What you'll see:** `data/parks.json?q=lake+louise&page=2&sort=name` and `Status: 200`. Click the request in the Network tab and open **Payload**: the three parameters are listed.

**Common mistake:** gluing strings by hand: `` `?q=${search}` ``. It works until someone types a space, `&` or `#`, and then the URL breaks. Let `URLSearchParams` do the encoding.

---

## Tier 4: Advanced

### Q16. Three requests at once with `Promise.all`

```js
async function loadDashboard() {
  const out = document.querySelector('#q16-out');
  try {
    const [parks, forecasts, config] = await Promise.all([
      getJSON('data/parks.json'),
      getJSON('data/weather.json'),
      getJSON('data/config.json'),
    ]);
    out.textContent = `${parks.length} parks · ${forecasts.length} forecasts · ${config.siteName}`;
  } catch (error) {
    out.textContent = `Dashboard failed (${error.message}).`;
  }
}
loadDashboard();
```

**Step by step**
1. Calling `getJSON` three times **without** `await` starts all three requests at once. You get three Promises.
2. `Promise.all([...])` makes one Promise that fulfils when **all** of them are done. Its value is an array of results **in the same order** you listed them, whatever order they finish in.
3. `const [parks, forecasts, config] = ...` unpacks that array into three names (array destructuring).
4. If **any** one fails, `Promise.all` rejects and you land in `catch`.

**What you'll see:** `5 parks · 4 forecasts · Park Finder`. In the Network tab's *Waterfall* column, the three bars start at the same moment.

**Common mistake:** `await`-ing each one in turn when they don't depend on each other. It works, but each request waits for the one before: three slow requests take three times as long.

### Q17. List and details (event delegation)

```js
const q17List = document.querySelector('#q17-list');
const q17Detail = document.querySelector('#q17-detail');

async function buildParkButtons() {
  const parks = await getJSON('data/parks.json');
  parks.forEach((park) => {
    const button = document.createElement('button');
    button.textContent = park.name;
    button.dataset.id = park.id;
    q17List.append(button);
  });
}
buildParkButtons();

q17List.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  q17Detail.textContent = 'Loading…';
  try {
    const park = await getJSON(`data/parks/${button.dataset.id}.json`);
    q17Detail.textContent = `${park.name} (${park.province}), founded ${park.founded}: ${park.description}`;
  } catch (error) {
    q17Detail.textContent = `Could not load that park (${error.message}).`;
  }
});
```

**Step by step**
1. Load the **list** and make a button per park. `button.dataset.id = park.id` writes `data-id="3"` on the element, so the button remembers which park it is.
2. Put **one** listener on the container. Clicks on any button bubble up to it. This works even though the buttons didn't exist when the page loaded.
3. `event.target.closest('button')` finds the button that was clicked (or `null` if the click hit the gaps).
4. Build the **detail** URL from the id: `data/parks/3.json`. Real APIs work the same way: `/api/parks` for the list, `/api/parks/3` for one.

**What you'll see:** five buttons. Click Elk Island: `Elk Island (AB), founded 1913: Bison, elk and quiet lakes just east of Edmonton.`

**Common mistake:** adding listeners with `document.querySelectorAll('#q17-list button')` at the top of the file. At that moment the buttons haven't been fetched and built yet, so the list is empty and nothing gets a listener.

### Q18. Send a POST request

```js
document.querySelector('#q18-btn').addEventListener('click', async () => {
  const visit = { parkId: 2, visitors: 4 };
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visit),
  };
  document.querySelector('#q18-body').textContent = options.body;
  const out = document.querySelector('#q18-out');
  try {
    const response = await fetch('data/visits', options);
    out.textContent = `Server answered ${response.status}`;
    out.className = response.ok ? 'status ok' : 'status error';
  } catch (error) {
    out.textContent = `Network error: ${error.message}`;
    out.className = 'status error';
  }
});
```

**Step by step**
1. `fetch(url, options)`: the second argument changes the request. Without it, `fetch` does a GET.
2. `method: 'POST'` means "here is new data for you".
3. The header `Content-Type: application/json` tells the server what kind of body is coming.
4. `body` must be a **string**, so `JSON.stringify(visit)` turns the object into `{"parkId":2,"visitors":4}`.
5. Show the status, and colour it with `ok`/`error` depending on `response.ok`.

**What you'll see:** `{"parkId":2,"visitors":4}` and `Server answered 501` in red with Python's server (Live Server shows another 4xx code). Click the request in the Network tab: **Headers** shows `Request Method: POST`, and **Payload** shows your JSON.

**Common mistake:** `body: visit` (no `JSON.stringify`). The browser turns the object into the text `[object Object]`, and a real server answers `400 Bad Request`.

### Q19. Broken JSON with a good status

```js
async function loadBroken() {
  const out = document.querySelector('#q19-out');
  try {
    const data = await getJSON('data/broken.json');
    out.textContent = `Site: ${data.siteName}`;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      out.textContent = 'The file is not valid JSON (SyntaxError)';
    } else {
      out.textContent = `Could not load: ${error.message}`;
    }
    console.error(error);
  }
}
loadBroken();
```

**Step by step**
1. Open `data/broken.json`: there's a comma after the last property. JSON doesn't allow that.
2. The server sends it happily: status `200`, `ok: true`. So `getJSON` doesn't throw for the status...
3. ...but `response.json()` can't parse it, so it **rejects** with a `SyntaxError`.
4. Every error has a `name`. Checking it lets you tell the user something more useful.
5. `console.error(error)` keeps the full details for you, the developer.

**What you'll see:** `The file is not valid JSON (SyntaxError)`. The Console shows the exact position, e.g. `Expected double-quoted property name in JSON at position 49 (line 4 column 1)`.

**Common mistake:** believing "status 200 means everything is fine". Three different things can go wrong: no answer (TypeError), a bad status (your own Error), and a bad body (SyntaxError).

### Q20. Follow the `next` links

```js
async function loadAllTrailPages() {
  const trails = [];
  let url = 'data/page-1.json';
  let pages = 0;
  while (url) {
    const page = await getJSON(url);
    trails.push(...page.items);
    pages += 1;
    url = page.next;
  }
  document.querySelector('#q20-out').textContent = `Loaded ${trails.length} trails from ${pages} pages.`;
}
loadAllTrailPages();
```

**Step by step**
1. Many APIs send big lists in **pages**, each with a link to the next one.
2. Start with the first URL. `while (url)` keeps going as long as there is a URL (`null` stops it).
3. `await` inside the loop is what we want here: we **can't** ask for page 2 until page 1 tells us where it is.
4. `trails.push(...page.items)` adds every item from this page (the `...` spreads the array).
5. Move on to `page.next`.

**What you'll see:** `Loaded 7 trails from 2 pages.` and two requests in the Network tab, one after the other.

**Common mistake:** forgetting `url = page.next`. The loop loads page 1 forever and the tab freezes. Close the tab, fix the line, reload.

---

## Tier 5: Applied

### Q21. Trail search (fetch once, filter many times)

```js
const q21Search = document.querySelector('#q21-search');
const q21List = document.querySelector('#q21-list');
const q21Count = document.querySelector('#q21-count');
let allTrails = [];

function showTrails() {
  const text = q21Search.value.trim().toLowerCase();
  const matches = allTrails.filter((trail) => trail.name.toLowerCase().includes(text));
  q21List.replaceChildren(...matches.map((trail) => {
    const li = document.createElement('li');
    li.textContent = `${trail.name} (${trail.park}, ${trail.km} km)`;
    return li;
  }));
  q21Count.textContent = `${matches.length} of ${allTrails.length} trails`;
}

async function startTrailSearch() {
  q21Count.textContent = 'Loading trails…';
  try {
    allTrails = await getJSON('data/trails.json');
    showTrails();
    q21Search.addEventListener('input', showTrails);
  } catch (error) {
    q21Count.textContent = `Trails did not load (${error.message}).`;
  }
}
startTrailSearch();
```

**Which technique and why:** the whole list is small and doesn't change while you type, so **fetch it once** and keep it in a variable. Each key press only filters the array in memory. Fetching on every key would send dozens of identical requests (watch the Network tab if you try it).

**Step by step**
1. `allTrails` lives outside the functions so both can use it.
2. On page load, fetch the file once, store it, show everything.
3. Only add the `input` listener **after** the data has arrived, so typing early can't filter an empty list.
4. `showTrails` lowercases both sides so `LAKE`, `Lake` and `lake` all match. `''.includes('')` is `true`, so an empty box shows all ten.
5. `replaceChildren(...array)` swaps the old items for the new ones in one go.

**What you'll see:** type `lake`: `5 of 10 trails`.

**Common mistake:** calling `fetch` inside the `input` handler. It works on a fast connection but floods the server, and answers can arrive out of order, so the list can briefly show results for an older search.

### Q22. Try a backup server

```js
async function loadFromMirrors() {
  const out = document.querySelector('#q22-out');
  const mirrors = ['data/mirror-a.json', 'data/mirror-b.json'];
  for (const url of mirrors) {
    try {
      const data = await getJSON(url);
      out.textContent = `Loaded from ${data.source}: ${data.status}`;
      return;
    } catch (error) {
      console.warn(`${url} failed: ${error.message}`);
    }
  }
  out.textContent = 'No mirror answered.';
}
loadFromMirrors();
```

**Which technique and why:** "in order, stop at the first success" means a **loop with `await`** and a `try`/`catch` **inside** the loop. `Promise.all` would be wrong here: it fails as soon as *one* request fails.

**Step by step**
1. `for...of` walks the URLs in order.
2. Each try either works (show it and `return`, which stops the whole function) or fails (log a warning and keep looping).
3. If the loop finishes without returning, nobody answered.

**What you'll see:** `Loaded from mirror-b: All trails open`. In the Network tab, a red 404 for `mirror-a.json`, then a 200 for `mirror-b.json`. The Console shows the warning for mirror-a.

**Common mistake:** putting the `try`/`catch` **around** the loop. Then the first 404 jumps out of the loop and mirror-b is never tried.

### Q23. Render a Markdown file without a library

```js
document.querySelector('#q23-btn').addEventListener('click', async () => {
  const out = document.querySelector('#q23-out');
  try {
    const response = await fetch('data/ranger-notes.md');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    out.replaceChildren();
    let list = null;
    markdown.split('\n').forEach((rawLine) => {
      const line = rawLine.trim();
      if (line === '') return;
      if (line.startsWith('- ')) {
        if (!list) {
          list = document.createElement('ul');
          out.append(list);
        }
        const li = document.createElement('li');
        li.textContent = line.slice(2);
        list.append(li);
        return;
      }
      list = null;
      const element = document.createElement(line.startsWith('# ') ? 'h3' : 'p');
      element.textContent = line.startsWith('# ') ? line.slice(2) : line;
      out.append(element);
    });
  } catch (error) {
    out.textContent = `Could not load the notes (${error.message}).`;
  }
});
```

**Which technique and why:** a `.md` file is text, so `response.text()`. We can't use `getJSON` (it would call `.json()`), so we do the `ok` check by hand.

**Step by step**
1. Load the text and split it into lines.
2. Skip blank lines.
3. A `- ` line becomes an `<li>`. If we're not already inside a list, start a new `<ul>` first; consecutive items share it.
4. Any other line ends the current list (`list = null`) and becomes an `<h3>` (if it starts with `# `) or a `<p>`.
5. `line.slice(2)` cuts off the `# ` or `- ` marker. `textContent` keeps it safe: any `<tags>` in the file show as text.

**What you'll see:** two headings, a paragraph, a three-item bullet list and another paragraph.

**Common mistake:** creating a new `<ul>` for **every** item, which gives three one-item lists. Keep the current list in a variable and reuse it. (For real Markdown, use a library such as *markdown-it*, as in demo 20.)

### Q24. Join two files by id

```js
async function showWeatherByPark() {
  const list = document.querySelector('#q24-list');
  try {
    const [parks, forecasts] = await Promise.all([
      getJSON('data/parks.json'),
      getJSON('data/weather.json'),
    ]);
    parks.forEach((park) => {
      const forecast = forecasts.find((f) => f.parkId === park.id);
      const li = document.createElement('li');
      li.textContent = forecast
        ? `${park.name}: ${forecast.high}°C / ${forecast.low}°C, ${forecast.condition}`
        : `${park.name}: no forecast`;
      list.append(li);
    });
  } catch (error) {
    list.textContent = `Weather did not load (${error.message}).`;
  }
}
showWeatherByPark();
```

**Which technique and why:** the files don't depend on each other, so load them **in parallel** (`Promise.all`). The forecast only has `parkId`, not a name, so for each park, `find` its forecast. This "join by id" is very common with real APIs.

**Step by step**
1. Load both files at once and unpack them.
2. For each park, `forecasts.find(...)` returns the first forecast with the same id, or `undefined`.
3. The `? :` (ternary) picks the sentence: with a forecast, or `no forecast`.

**What you'll see:** five lines, ending with `Yoho: no forecast`.

**Common mistake:** `f.parkId == park.name` or comparing the wrong fields. Look at both files and match the **id** in one to the **id** in the other.

### Q25. Send a message, properly

```js
const q25Form = document.querySelector('#q25-form');
const q25Message = document.querySelector('#q25-message');
const q25Send = document.querySelector('#q25-send');
const q25Status = document.querySelector('#q25-status');

q25Form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = q25Message.value.trim();
  if (message === '') {
    q25Status.className = 'status error';
    q25Status.textContent = 'Please write a message.';
    return;
  }
  q25Send.disabled = true;
  q25Status.className = 'status loading';
  q25Status.textContent = 'Sending…';
  try {
    const response = await fetch('data/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    q25Status.className = 'status ok';
    q25Status.textContent = 'Sent!';
    q25Form.reset();
  } catch (error) {
    q25Status.className = 'status error';
    q25Status.textContent = `Not sent (${error.message}). Your message is still here.`;
  } finally {
    q25Send.disabled = false;
  }
});
```

**Which technique and why:** this pulls the day together: form `submit` + `preventDefault` (Day 16), validation before sending, a loading state with a disabled button, a POST with a JSON body, an `ok` check, and `finally`.

**Step by step**
1. Validate **before** any request. No point sending an empty message.
2. Disable the button and say `Sending…`, so a double click can't send it twice.
3. `{ message }` is shorthand for `{ message: message }`.
4. Throw on `!response.ok`, so a refused POST is treated as a failure.
5. Only clear the form on success. On failure the user keeps what they typed, which is kind.
6. `finally` turns the button back on either way.

**What you'll see:** empty: `Please write a message.` With text, on a file server: `Sending…` then `Not sent (HTTP 501). Your message is still here.`, and your text is still in the box.

**Common mistake:** calling `q25Form.reset()` straight after `fetch`, before you know whether it worked. If the send fails, the user's message is gone.

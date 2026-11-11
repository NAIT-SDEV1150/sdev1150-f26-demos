# Day 21 practice: fetch and asynchronous code (25 questions)

**How to work:** open `index.html` with **Live Server** (or open a terminal in this folder and run `python3 -m http.server`, then visit `http://localhost:8000`). `fetch` does **not** work if you double-click the file, because `file://` pages can't make requests.

Write every answer in `main.js`, one under the other, with a comment like `// Q1` above each one. Save, then check the page, the **Console** and the **Network** tab after each answer.

**Everything works offline.** All the data is in the `data/` folder:

| File | What's in it |
|---|---|
| `data/message.json` | `{ "message": "..." }` |
| `data/tip.json`, `data/fact.json` | `{ "text": "..." }` |
| `data/notes.txt` | plain text (not JSON) |
| `data/config.json` | `{ "siteName", "version", "units" }` |
| `data/parks.json` | an array of 5 parks: `{ id, name, province, areaKm2, campsites }` |
| `data/parks/1.json` … `5.json` | one park each: `{ id, name, province, founded, description }` |
| `data/weather.json` | an array of forecasts: `{ parkId, high, low, condition }` |
| `data/page-1.json`, `data/page-2.json` | `{ page, items: [{ name, km }], next }` (`next` is the next URL, or `null`) |
| `data/trails.json` | an array of 10 trails: `{ name, park, km }` |
| `data/mirror-b.json` | `{ source, status }` (there is no `mirror-a.json`) |
| `data/broken.json` | **broken** JSON, on purpose |
| `data/ranger-notes.md` | a small Markdown file |

**Rules:** `const`/`let`, arrow functions, template literals, `textContent`. Don't change `index.html`, `styles.css` or the `data/` files. Don't use `innerHTML`.

**Helper classes** in `styles.css`: `.loading`, `.ok`, `.empty`, `.error`, `.hidden`, `.status`.

**One helper you may copy** (it makes a promise that fulfils after `ms` milliseconds, to fake a slow network):

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```

The questions get harder as you go. Answers and step-by-step walkthroughs are in `WALKTHROUGH.md`. Try first, then check.

---

## Tier 1: Simple (one idea, one or two lines)

**Q1.** Fetch `data/message.json`. Show the response's **status code** in `#q1-out`. Use `.then()`. (You should see `200`.)

**Q2.** Fetch `data/message.json`, turn the body into an object with `.json()`, and show its `message` in `#q2-out`. Use a `.then()` chain.

**Q3.** Do the same kind of thing with **`async`/`await`**: write `async function loadTip()` that fetches `data/tip.json` and shows its `text` in `#q3-out`. Call the function.

**Q4.** Fetch `data/does-not-exist.json`. Show `ok: <ok>, status: <status>` in `#q4-out`. Before you run it, predict: does the `.then()` run at all?

**Q5.** Fetch `data/notes.txt`. It is **not** JSON. Read it as text and show it in `#q5-out` (a `<pre>`, so the line breaks stay).

## Tier 2: Easy

**Q6.** Load `data/parks.json` and show `There are 5 parks.` in `#q6-out`. Don't type the 5: use the array's length.

**Q7.** Load `data/parks.json` and add one `<li>` per park name to `#q7-list`.

**Q8.** **Order test.** When `#q8-btn` is clicked:
1. set `#q8-out` to `A`,
2. start a fetch of `data/message.json`, and in its `.then()` add ` C`,
3. **after** the fetch line, add ` B`.

What does the page show, and why isn't it `A C B`?

**Q9.** When `#q9-btn` is clicked (and not before), fetch `data/fact.json` and show its `text` in `#q9-out`. Watch the Network tab: the request appears only when you click.

**Q10.** Fetch `https://no-such-host.invalid/parks.json` (that address can never exist). Add a `.catch()` that shows `Network error: <the error's message>` in `#q10-out`.

## Tier 3: Competent (everyone must be able to do these)

**Q11.** Write a reusable helper `async function getJSON(url)` that:
- fetches the URL,
- **throws** `new Error(\`HTTP ${response.status}\`)` if `response.ok` is false,
- otherwise returns the parsed JSON.

Use it to load `data/config.json` and show `Welcome to <siteName>` in `#q11-out`. You'll use `getJSON` in most of the questions below.

**Q12.** Use `getJSON` with `try`/`catch` to load `data/missing.json`. Show `Could not load: HTTP 404` in `#q12-out` and give it the class `error`.

**Q13.** **Loading state.** When `#q13-btn` is clicked:
- disable the button and show `Loading…` (class `loading`) in `#q13-status`,
- `await wait(800)` (pretend the network is slow), then load `data/parks.json`,
- show `Loaded 5 parks.` (class `ok`), or an error message (class `error`) if it fails,
- turn the button back on **whether it worked or not**.

**Q14.** **Form submit.** When `#q14-form` is submitted, stop the page reload, load `data/parks.json` and list the parks whose `province` matches the `#q14-province` choice in `#q14-list`. Show `3 parks in AB.` in `#q14-status`, or `No parks found in SK.` (class `empty`) when nothing matches. Clear the old list each time.

**Q15.** Use **`URLSearchParams`** to build this query string from an object `{ q: 'lake louise', page: 2, sort: 'name' }`. Show the full URL `data/parks.json?q=lake+louise&page=2&sort=name` in `#q15-out`. Then fetch that URL and show `Status: <status>` in `#q15-status`. (A file server ignores the query string, so you'll still get the file.)

## Tier 4: Advanced

**Q16.** Load `data/parks.json`, `data/weather.json` and `data/config.json` **at the same time** with `Promise.all`. Show `5 parks · 4 forecasts · Park Finder` in `#q16-out`. Look at the Network tab's waterfall: the three bars start together.

**Q17.** **List and details.** Load `data/parks.json` and make one `<button>` per park inside `#q17-list`, with the park's id in `data-id`. When any of those buttons is clicked, fetch `data/parks/<id>.json` and show `<name> (<province>), founded <founded>: <description>` in `#q17-detail`. Use **one** listener on `#q17-list` (event delegation).

**Q18.** **POST.** When `#q18-btn` is clicked, send `{ parkId: 2, visitors: 4 }` to `data/visits` with `method: 'POST'`, a `Content-Type: application/json` header, and the body made with `JSON.stringify`. Show the body string in `#q18-body`. Show `Server answered <status>` in `#q18-out`, class `ok` if `response.ok`, otherwise `error`.

> A plain file server can't save anything, so it will **refuse** the POST (Python answers `501`, Live Server usually `404` or `405`). That's fine: the point is a correct request and honest handling of the answer. Against a real API, the same code gets `201 Created`.

**Q19.** Load `data/broken.json` with `getJSON`. The status is `200`, but the JSON is broken. Catch the error and, if `error.name` is `'SyntaxError'`, show `The file is not valid JSON (SyntaxError)` in `#q19-out`. Any other error: `Could not load: <message>`.

**Q20.** **Pages.** `data/page-1.json` has some trails and a `next` URL. `data/page-2.json` has more and `next: null`. Starting from page 1, keep loading the `next` page until there isn't one. Show `Loaded 7 trails from 2 pages.` in `#q20-out`. Don't hard-code the page names after the first one.

## Tier 5: Applied (you decide the technique)

**Q21.** **Trail search.** As someone types in `#q21-search`, show only the trails from `data/trails.json` whose name contains what they typed (any case) in `#q21-list`, as `Name (Park, km km)`. Show `5 of 10 trails` in `#q21-count`. An empty box shows all ten. Think: should you fetch on every key press?

**Q22.** **Backup server.** The data might be on `data/mirror-a.json` or `data/mirror-b.json`. Try them **in order** and use the first one that works. Show `Loaded from <source>: <status>` in `#q22-out`. If none works, show `No mirror answered.`

**Q23.** **Not JSON.** When `#q23-btn` is clicked, load `data/ranger-notes.md` and show it in `#q23-out` as real elements: lines starting with `# ` become `<h3>`, lines starting with `- ` become `<li>` items inside a `<ul>`, other non-empty lines become `<p>`. (No library and no `innerHTML`. In class we used *markdown-it* for full Markdown.)

**Q24.** **Join two files.** When the page loads, show one `<li>` per park in `#q24-list` like `Banff: 4°C / -6°C, light snow`, using the names from `data/parks.json` and the forecasts from `data/weather.json` (matched by `parkId`). A park with no forecast shows `Yoho: no forecast`. Load the two files in parallel.

**Q25.** **Send a message, properly.** When `#q25-form` is submitted:
- If `#q25-message` is empty (after trimming), show `Please write a message.` (class `error`) and send nothing.
- Otherwise disable `#q25-send`, show `Sending…`, and POST `{ message }` as JSON to `data/messages`.
- On success show `Sent!` and clear the form.
- On failure show `Not sent (<reason>). Your message is still here.` and **keep** what they typed.
- Always turn the button back on.

On a file server you'll see the failure path, which is exactly what you need to test.

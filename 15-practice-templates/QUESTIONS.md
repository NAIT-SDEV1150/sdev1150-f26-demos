# Day 19 practice: templates and reusable UI (25 questions)

**How to work:** open `index.html` with Live Server. Write every answer in `main.js`, one under the other. Put a comment like `// Q1` above each answer. Save, then check the page (and the Console) after each one.

**Rules:** use `const` and `let`, arrow functions and template literals. Don't change `index.html` or `styles.css`. Don't use `innerHTML` (Q21 shows you why). Every `<template>` you need is already in `index.html`: open the Elements panel and read it before you start each question.

**Classes you can use** (already in `styles.css`): `.liked`, `.selected`, `.cold`.

**Names:** all 25 answers live in one file, so two answers can't both make a `const` with the same name. If a name is taken, add the question number (`q6Copy`, `q7Copy`).

**Tiers:** Simple (one idea, one or two lines) · Easy · Competent (what every student must be able to do) · Advanced · Applied (real problems where you decide which technique to use). Answers and step-by-step explanations are in `WALKTHROUGH.md`. Try first, then check.

---

## Tier 1: Simple

**Q1.** Select `#q1-template`. Without cloning it, show how many **elements** are inside its content in `#q1-out`, like this: `The template holds 3 elements.` (Use the real number, don't type 3.)

**Q2.** Clone the content of `#q2-template` and append the copy to `#q2-box`.

**Q3.** `#q3-template` holds one empty `<span class="tag">`. Clone it, put the text `New arrival` in the `.tag`, then append it to `#q3-box`.

**Q4.** `#q4-product` has two `data-` attributes. Use `dataset` to show `SKU MPL-250, in stock: yes` in `#q4-out`. (Read the values from the element, don't type them.)

**Q5.** `#q5-list` has three old items. Empty it with **one** method call.

---

## Tier 2: Easy

**Q6.** Clone `#product-template`. Fill `.product-name` with `Maple syrup` and `.product-price` with the price, from this number, shown with two decimals: `const syrupPrice = 12.99;` → `$12.99`. Append it to `#q6-shelf`.

**Q7.** Use this object to fill a copy of `#photo-template`, then append it to `#q7-gallery`:

```js
const photo = {
  file: 'images/lake.svg',
  alt: 'A blue lake below grey mountains',
  caption: 'Moraine Lake, Banff National Park',
  link: 'https://parks.canada.ca/pn-np/ab/banff',
};
```

The image needs its `src` and `alt`, the link needs its `href`, and the caption needs its text.

**Q8.** Write a function `createTag(text)` that **returns a `<span class="tag">` element** (the element itself, not a fragment) built from `#q3-template`. Use it to add three tags to `#q8-box`: `HTML`, `CSS`, `JavaScript`.

**Q9.** Show every genre in this array as an `li` built from `#genre-template`, inside `#q9-list`. Use `forEach`.

```js
const genres = ['Rock', 'Jazz', 'Folk', 'Hip hop'];
```

**Q10.** Clone `#q10-template`. Count the elements in the clone **before** and **after** you append it to `#q10-box`. Show the result in `#q10-out`, like `Before: 2, after: 0`. Then explain the "after" number in a comment.

---

## Tier 3: Competent (one playlist app, built up over five questions)

Paste this data first:

```js
let songs = [
  { id: 's1', title: 'Northern Lights', artist: 'The Prairie Band', seconds: 215, liked: false },
  { id: 's2', title: 'Chinook Wind', artist: 'Foothills', seconds: 187, liked: true },
  { id: 's3', title: 'Bow River', artist: 'Glacier Blue', seconds: 254, liked: false },
  { id: 's4', title: 'First Snow', artist: 'Aurora Kids', seconds: 199, liked: false },
];
const extraSongs = [
  { title: 'Rocky Road', artist: 'Mountain Time', seconds: 230 },
  { title: 'Prairie Sky', artist: 'Wide Open', seconds: 176 },
];
```

**Q11.** Write two functions.
- `formatLength(totalSeconds)` returns a time like `3:35` (215 seconds). Seconds always have two digits: 187 → `3:07`.
- `createSongItem(song)` clones `#song-template` and **returns the `li.song`**. Give it `data-id` (from `song.id`), and fill `.song-title`, `.song-artist` and `.song-length`.

Test it by appending `createSongItem(songs[0])` to `#q11-preview`.

**Q12.** Write `renderPlaylist()`. It draws **every** song in `songs` into `#playlist`, using `replaceChildren` and `map`, and shows the count and total time in `#playlist-count`, like `4 songs · 14:15 total`. Call it **twice** in a row. You should still see 4 songs, not 8.

**Q13.** Add **one** click listener to `#playlist` (event delegation). When a **Delete** button is clicked, remove that song from the `songs` array, then call `renderPlaylist()`. Use `closest()` and the `data-id`.

**Q14.** Make **Like** work. In the **same** listener as Q13 (don't add a second one), a Like click flips that song's `liked` value in the array, then re-renders. Update `createSongItem` so a liked song's `li` has the class `liked` and its button says `♥ Liked` (otherwise `♡ Like`). Song `s2` starts liked.

**Q15.** Keep the page honest.
- When the playlist is empty, show `#playlist-empty` (it has the `hidden` attribute); when it has songs, hide it. Put this inside `renderPlaylist()`.
- Make `#q15-add` add the next song from `extraSongs` (go back to the first one when you run out). Each new song needs a new, unique id (`s5`, `s6`, ...) and `liked: false`.
- Write `1 song` (not `1 songs`) when there's exactly one.

---

## Tier 4: Advanced

**Q16.** Render this comment thread into `#q16-thread` using `#comment-template`. Replies sit inside their parent's `.replies` list, and replies can have replies. If a comment has no replies, remove its empty `.replies` list. (Hint: a function can call itself.)

```js
const thread = [
  {
    id: 1, author: 'maple_dev', time: '2 h ago', body: 'Templates finally clicked for me today.',
    replies: [
      {
        id: 2, author: 'css_cat', time: '1 h ago', body: 'Same! The fragment emptying part confused me at first.',
        replies: [
          { id: 3, author: 'maple_dev', time: '45 min ago', body: 'Fill it before you append it. That fixed mine.', replies: [] },
        ],
      },
    ],
  },
  { id: 4, author: 'js_moose', time: '30 min ago', body: 'Has anyone tried replaceChildren yet?', replies: [] },
];
```

**Q17.** Show these products in `#q17-list` as cards from `#product-template` (write a `createProductCard(product)` factory). The `#q17-sort` dropdown sorts them (name A to Z, price low to high, price high to low) and `#q17-max` hides anything over that price (empty box = no limit). Both update the list straight away. **The `products` array must never change order.**

```js
const products = [
  { name: 'Toque', price: 24.5 },
  { name: 'Mitts', price: 18 },
  { name: 'Mug', price: 15 },
  { name: 'Scarf', price: 32 },
  { name: 'Stickers', price: 4.25 },
];
```

**Q18.** Build a cart in `#cart` from `#cart-template`. `+` adds one, `−` takes one away, and a row that reaches 0 disappears. Each row shows its line price (`$36.00` for 2 mitts), and `#cart-total` shows `Total: $75.50` to start. Use **one** listener.

```js
let cart = [
  { id: 'toque', name: 'Toque', price: 24.5, qty: 1 },
  { id: 'mitts', name: 'Mitts', price: 18, qty: 2 },
  { id: 'mug', name: 'Mug', price: 15, qty: 1 },
];
```

**Q19.** The three cards in `#q19-grid` are already on the page. Clicking **anywhere** on a card (the picture, the emoji, the price) selects it: it gets the class `selected`, any other card loses it, and `#q19-out` says `Selected: Mitts`. Clicking the empty gap between cards does nothing. Use one listener on the grid.

**Q20.** Show these notes in `#q20-list` from `#note-template`. Delete removes a note. `#q20-undo` puts the **last** deleted note back **in the same position** it came from. The Undo button is disabled when there's nothing to undo.

```js
let notes = [
  { id: 1, text: 'Buy a new toque' },
  { id: 2, text: 'Book the ski trip' },
  { id: 3, text: 'Return library books' },
];
```

---

## Tier 5: Applied

**Q21.** A teammate wrote this to show product reviews. **Don't run it.** One review was typed by someone trying to break the site: if this code runs, a red "Something ran code" banner appears.

```js
const reviews = [
  { author: 'Pat', stars: 5, text: 'Great toque, very warm.' },
  { author: 'Lee', stars: 2, text: 'Too small <img src="x" onerror="document.body.classList.add(\'hacked\')">' },
  { author: 'Sam', stars: 4, text: 'Nice colour. I wear it every day.' },
];
// Teammate's version (unsafe):
// reviewList.innerHTML = reviews.map((r) => `<li><b>${r.author}</b> ${'★'.repeat(r.stars)}<p>${r.text}</p></li>`).join('');
```

Rewrite it safely with `#review-template` into `#q21-reviews`. Lee's review must show its text exactly as typed (you'll see `<img ...>` as words). Stars show filled and empty, out of 5: `★★☆☆☆`.

**Q22.** A page of upcoming events. Show the first 4 in `#q22-list` (from `#event-template`). Each click on `#q22-more` adds the **next** 4 below them, without rebuilding the ones already there. `#q22-status` says `Showing 4 of 10`, and the button disappears once everything is shown. Each `<time>` gets its `datetime` attribute and its text from `date`.

```js
const upcoming = [
  { date: '2026-11-07', name: 'Coding club' },
  { date: '2026-11-12', name: 'Library study night' },
  { date: '2026-11-14', name: 'Skating at the rink' },
  { date: '2026-11-19', name: 'Guest talk: accessibility' },
  { date: '2026-11-21', name: 'Board game afternoon' },
  { date: '2026-11-26', name: 'Hack night' },
  { date: '2026-11-28', name: 'Winter market' },
  { date: '2026-12-03', name: 'Portfolio review' },
  { date: '2026-12-05', name: 'Food bank drive' },
  { date: '2026-12-10', name: 'End-of-term party' },
];
```

**Q23.** Fill the `tbody` of `#q23-table` with one row per city from `#row-template`. Temperature shows like `-12 °C`. The Feels column says `Cold` below 0, `Mild` from 0 to 15, and `Warm` above 15. Rows below 0 get the class `cold`. Then answer in a comment: why is this row written inside a `<template>` and not inside a hidden `<div>`?

```js
const weather = [
  { city: 'Calgary', temp: -4 },
  { city: 'Edmonton', temp: -12 },
  { city: 'Vancouver', temp: 9 },
  { city: 'Toronto', temp: 3 },
  { city: 'Kelowna', temp: 16 },
];
```

**Q24.** A two-column task board. Tasks with `status: 'todo'` go in `#q24-todo`; `'done'` go in `#q24-done`, both from `#task-template`. The button says `Done ✓` in the To do column and `Undo ↺` in the Done column, and clicking it moves the task to the other column. Keep the counts in `#q24-todo-count` and `#q24-done-count` right. Use **one** listener for the whole board.

```js
let tasks = [
  { id: 't1', text: 'Read the template chapter', status: 'todo' },
  { id: 't2', text: 'Finish practice Q1-Q10', status: 'done' },
  { id: 't3', text: 'Try the playlist questions', status: 'todo' },
  { id: 't4', text: 'Review event delegation', status: 'todo' },
];
```

**Q25.** A team directory with live search. Show everyone in `#q25-list` (from `#person-template`; the email is a working `mailto:` link). As you type in `#q25-search`, show only people whose name **or** role contains the text, ignoring upper/lower case. `#q25-status` says `Showing 3 of 8`. When nobody matches, show `#q25-empty` with the text `No one matches "xyz".` (using what was typed).

```js
const team = [
  { name: 'Avery Chen', role: 'Designer', email: 'avery@example.com' },
  { name: 'Jordan Blake', role: 'Front-end developer', email: 'jordan@example.com' },
  { name: 'Riley Singh', role: 'Back-end developer', email: 'riley@example.com' },
  { name: 'Morgan Dubois', role: 'Tester', email: 'morgan@example.com' },
  { name: 'Casey Okafor', role: 'Front-end developer', email: 'casey@example.com' },
  { name: 'Taylor Nguyen', role: 'Project manager', email: 'taylor@example.com' },
  { name: 'Quinn Martel', role: 'Designer', email: 'quinn@example.com' },
  { name: 'Drew Larsen', role: 'Accessibility specialist', email: 'drew@example.com' },
];
```

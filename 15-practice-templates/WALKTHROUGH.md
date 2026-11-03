# Day 19 practice: walkthrough and answers

Try each question on your own first. Then come here to check.

Every answer below was tested in a real browser (Microsoft Edge) against `index.html`. You can paste them all into one `main.js`, one after the other. The playlist questions (Q11-Q15) build **one** app: when a later question says "replace" or "update", change your earlier code instead of adding a second copy.

Each question has the same parts:
- **Answer:** the code
- **Step by step:** what each line does
- **Why it works**
- **Common mistake:** and what you'll see when you make it

Three ideas come up again and again. If you get stuck, come back to these:

1. **`template.content` is a DocumentFragment**: a light, invisible box holding the template's elements. You **clone** it (`cloneNode(true)`) and never change the original.
2. **A fragment empties when you append it.** Its children *move* to the page. So fill the copy **before** you append it, or grab the real element out of it first.
3. **The array is the truth; the page is a picture of it.** Change the array, then call your render function. Don't edit the page by hand and hope the array keeps up.

---

## Tier 1: Simple

### Q1. Count what's inside a template

```js
const q1Template = document.querySelector('#q1-template');
document.querySelector('#q1-out').textContent = `The template holds ${q1Template.content.children.length} elements.`;
```

**Step by step**
1. `querySelector('#q1-template')` finds the `<template>` element itself. That part *is* on the page; it's just not drawn.
2. `.content` is the fragment that holds what you wrote between `<template>` and `</template>`.
3. `.children` lists only the **elements** in it (the `<h4>` and two `<p>`s), so `.length` is 3.
4. The template literal puts the number into the sentence.

**Why it works:** the browser reads the template's HTML and builds real elements, but parks them in `.content` instead of on the page.

**Common mistake:** using `q1Template.children.length`. The template element itself has **no** children: they live in `.content`. You'll see `The template holds 0 elements.` Another one: `.childNodes.length` counts the spaces and line breaks between tags too (text nodes), so you'd get 7, not 3.

### Q2. Clone and append

```js
const q2Template = document.querySelector('#q2-template');
document.querySelector('#q2-box').append(q2Template.content.cloneNode(true));
```

**Step by step**
1. Find the template.
2. `q2Template.content.cloneNode(true)` makes a **deep copy** of the content: the `<p>` and the text inside it.
3. `append(...)` puts that copy inside `#q2-box`. The sentence appears.

**Why it works:** the copy is a normal fragment, and appending a fragment adds everything in it.

**Common mistake:** `append(q2Template.content)` with no clone. It works **once**: the elements move out of the template, and the template is now empty. The second time you try, nothing appears. Always clone.

### Q3. Clone, fill, append

```js
const q3Template = document.querySelector('#q3-template');
const q3Copy = q3Template.content.cloneNode(true);
q3Copy.querySelector('.tag').textContent = 'New arrival';
document.querySelector('#q3-box').append(q3Copy);
```

**Step by step**
1. Find the template and clone its content into `q3Copy`.
2. `q3Copy.querySelector('.tag')` searches **inside the copy only** (not the whole page) and finds the empty `<span>`.
3. Set its text with `textContent`.
4. Append the filled copy.

**Why it works:** a fragment has its own `querySelector`, so you can fill it before it goes on the page.

**Common mistake:** swapping the last two lines (append first, then fill). After `append`, the fragment is empty, so `q3Copy.querySelector('.tag')` returns `null` and the Console says:
`Uncaught TypeError: Cannot set properties of null (setting 'textContent')`.

### Q4. Read `data-` attributes with `dataset`

```js
const q4Product = document.querySelector('#q4-product');
document.querySelector('#q4-out').textContent = `SKU ${q4Product.dataset.sku}, in stock: ${q4Product.dataset.inStock}`;
```

**Step by step**
1. Look at the HTML: `data-sku="MPL-250"` and `data-in-stock="yes"`.
2. Every `data-` attribute shows up on `element.dataset` without the `data-` part.
3. Dashes become camelCase: `data-in-stock` becomes `dataset.inStock`.

**Why it works:** `dataset` is the browser's built-in way to read and write your own custom attributes.

**Common mistake:** writing `dataset['in-stock']` or `dataset.in-stock`. The first gives `undefined`; the second is read by JavaScript as "`dataset.in` minus `stock`" and crashes with `ReferenceError: stock is not defined`.

### Q5. Empty an element in one call

```js
document.querySelector('#q5-list').replaceChildren();
```

**Step by step**
1. `replaceChildren(...)` throws away every child and puts in whatever you pass.
2. Passing **nothing** means "throw them all away and put nothing back".

**Why it works:** it's the modern, clear way to clear an element. You'll use it in every render function.

**Common mistake:** `list.remove()`. That removes the whole `<ul>`, not just what's inside it. (`list.textContent = ''` also clears it, but `replaceChildren()` says what you mean and can add new children in the same call.)

---

## Tier 2: Easy

### Q6. A product card

```js
const productTemplate = document.querySelector('#product-template');
const q6Copy = productTemplate.content.cloneNode(true);
const syrupPrice = 12.99;
q6Copy.querySelector('.product-name').textContent = 'Maple syrup';
q6Copy.querySelector('.product-price').textContent = `$${syrupPrice.toFixed(2)}`;
document.querySelector('#q6-shelf').append(q6Copy);
```

**Step by step**
1. Find the template (we name it `productTemplate` because Q17 uses it again) and clone it.
2. Fill the name.
3. `toFixed(2)` turns the number into a string with exactly two decimals: `'12.99'`. (`4.5.toFixed(2)` would be `'4.50'`.)
4. `` `$${...}` ``: the first `$` is a real dollar sign; `${` starts the slot.
5. Append.

**Why it works:** clone → fill → append is the pattern for every template. Memorise it.

**Common mistake:** `` `${syrupPrice}` `` without `toFixed`. It works for 12.99, but a price of 18 shows as `$18` and 4.5 shows as `$4.5`.

### Q7. Fill attributes: `src`, `alt`, `href`

```js
const photo = {
  file: 'images/lake.svg',
  alt: 'A blue lake below grey mountains',
  caption: 'Moraine Lake, Banff National Park',
  link: 'https://parks.canada.ca/pn-np/ab/banff',
};
const q7Copy = document.querySelector('#photo-template').content.cloneNode(true);
const q7Img = q7Copy.querySelector('.photo-img');
q7Img.src = photo.file;
q7Img.alt = photo.alt;
q7Copy.querySelector('.photo-link').href = photo.link;
q7Copy.querySelector('.photo-caption').textContent = photo.caption;
document.querySelector('#q7-gallery').append(q7Copy);
```

**Step by step**
1. Clone the template.
2. Save the image in `q7Img` since you set two things on it.
3. `img.src` and `img.alt` set the `src=""` and `alt=""` attributes.
4. `a.href` sets the link's destination.
5. The caption is text, so `textContent`.
6. Append.

**Why it works:** most attributes have a matching property with the same name. Setting the property updates the attribute.

**Common mistake:** `q7Img.textContent = photo.file`. An `<img>` has no text inside it; nothing visible happens and the picture stays broken. Also: forgetting `alt`. The page looks fine to you but a screen reader user hears "image" with no description.

### Q8. A factory that returns an element

```js
function createTag(text) {
  const tag = q3Template.content.querySelector('.tag').cloneNode(true); // clone just the <span>
  tag.textContent = text;
  return tag;
}
const q8Box = document.querySelector('#q8-box');
q8Box.append(createTag('HTML'), createTag('CSS'), createTag('JavaScript'));
```

**Step by step**
1. `q3Template` is the template you found in Q3.
2. `q3Template.content.querySelector('.tag')` finds the original `<span>` **inside the template**. Then `.cloneNode(true)` copies just that element. (We never change the original.)
3. Fill the copy and `return` it. The function doesn't touch the page.
4. `append` accepts several things at once, so three calls fit in one line.

**Why it works:** because you return the `<span>` itself (not a fragment), the caller gets something solid it can append, style, or remove later.

**Another correct way:** `const tag = q3Template.content.cloneNode(true).querySelector('.tag');` (clone the whole fragment, then pull the span out).

**Common mistake:** `return q3Template.content.cloneNode(true);` with the text set first. It looks fine here, but you returned a **fragment**. After it's appended, that fragment is empty, so later code like `createTag('x').classList.add(...)` affects nothing useful. Return the element.

### Q9. Render an array with `forEach`

```js
const genres = ['Rock', 'Jazz', 'Folk', 'Hip hop'];
const genreTemplate = document.querySelector('#genre-template');
const q9List = document.querySelector('#q9-list');
genres.forEach((genre) => {
  const copy = genreTemplate.content.cloneNode(true);
  copy.querySelector('.genre').textContent = genre;
  q9List.append(copy);
});
```

**Step by step**
1. Find the template and the list **once**, outside the loop.
2. `forEach` runs the arrow function once per genre.
3. Each time: a **new** clone, fill it, append it.

**Why it works:** each trip through the loop makes a fresh copy, so you get four separate `li`s.

**Common mistake:** cloning once **before** the loop and appending the same copy each time. The first append empties the fragment, so you get one item (`Rock`), then `Uncaught TypeError: Cannot set properties of null (setting 'textContent')` on the second trip, and the loop stops. One clone per item.

### Q10. Watch a fragment empty

```js
const q10Fragment = document.querySelector('#q10-template').content.cloneNode(true);
const q10Before = q10Fragment.children.length;
document.querySelector('#q10-box').append(q10Fragment);
const q10After = q10Fragment.children.length;
document.querySelector('#q10-out').textContent = `Before: ${q10Before}, after: ${q10After}`;
// After is 0 because append MOVES the fragment's children onto the page.
// The fragment is only a carrying box; once unpacked, it's empty.
```

**Step by step**
1. Clone; the fragment holds 2 `<p>`s.
2. Count them: 2.
3. Append. The two paragraphs move into `#q10-box`.
4. Count again: 0. The box is empty; the paragraphs are on the page now.

**Why it works:** an element can only be in one place in the DOM. Appending a fragment moves its children rather than copying them.

**Common mistake:** expecting "after" to be 2 and then writing code that uses the fragment after appending it (see Q3).

---

## Tier 3: Competent (one playlist app)

Paste the `songs` and `extraSongs` data from QUESTIONS.md first.

### Q11. `formatLength` and the `createSongItem` factory

```js
const songTemplate = document.querySelector('#song-template');

function formatLength(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function createSongItem(song) {
  const item = songTemplate.content.cloneNode(true).querySelector('.song');
  item.dataset.id = song.id;
  item.querySelector('.song-title').textContent = song.title;
  item.querySelector('.song-artist').textContent = song.artist;
  item.querySelector('.song-length').textContent = formatLength(song.seconds);
  return item;
}
document.querySelector('#q11-preview').append(createSongItem(songs[0]));
```

**Step by step**
1. `Math.floor(215 / 60)` is 3 (whole minutes). `215 % 60` is 35 (the leftover seconds).
2. `padStart(2, '0')` makes sure seconds have two digits: `'7'` becomes `'07'`. It's a string method, so turn the number into a string first.
3. In the factory, clone the template and immediately pull out the real `li.song`. From now on we work with `item`, a real element that won't empty.
4. `item.dataset.id = song.id` writes `data-id="s1"` into the HTML. That's the label we'll use in Q13 to find which song was clicked.
5. Fill the three spans and `return item`.
6. Test by appending one song to the preview list.

**Why it works:** a factory is "data in, element out". It doesn't know or care where the element ends up.

**Common mistake:** `item.id = song.id` instead of `dataset.id`. That sets the HTML `id`, which must be unique on the whole page; since Q11's preview and the Q12 list both show song `s1`, you'd have two elements with the same id. Use `data-id` for "which data item is this?".

### Q12. `renderPlaylist` with `replaceChildren` and `map`

```js
const playlist = document.querySelector('#playlist');
const playlistCount = document.querySelector('#playlist-count');
const playlistEmpty = document.querySelector('#playlist-empty'); // used in Q15

function renderPlaylist() {
  playlist.replaceChildren(...songs.map(createSongItem));
  let total = 0;
  songs.forEach((song) => { total += song.seconds; });
  playlistCount.textContent = `${songs.length} ${songs.length === 1 ? 'song' : 'songs'} · ${formatLength(total)} total`;
}
renderPlaylist();
renderPlaylist(); // called twice on purpose: still 4 songs, not 8
```

**Step by step**
1. `songs.map(createSongItem)` turns the array of song **objects** into an array of `li` **elements**, one per song.
2. `...` (spread) unpacks that array into separate arguments, because `replaceChildren` wants `replaceChildren(li1, li2, li3, li4)`, not one array.
3. `replaceChildren` removes the old `li`s and puts the new ones in, in one step.
4. Add up the seconds with `forEach`, then format the total (855 seconds → `14:15`).
5. The `? :` picks `song` or `songs`. (You need it for Q15.)

**Why it works:** because the function always starts from empty, calling it again just redraws the same picture. That's what lets us call it after every change.

**Common mistake:** using `playlist.append(...)` instead of `replaceChildren`. The second call adds 4 more, and you see 8 songs. Also: forgetting the `...`. `replaceChildren(array)` puts the text `[object HTMLLIElement],...` on the page.

### Q13. Delete with one delegated listener

```js
playlist.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.closest('.song').dataset.id;

  if (button.dataset.action === 'delete') {
    songs = songs.filter((song) => song.id !== id);
  }
  renderPlaylist();
});
```

**Step by step**
1. One listener on the `<ul>`. Clicks on any button inside it **bubble up** to here.
2. `event.target` is whatever was actually clicked. `closest('button[data-action]')` walks **up** from there (starting with the element itself) to the nearest button that has a `data-action`. If the click wasn't on a button, it returns `null`, and we stop.
3. From the button, `closest('.song')` walks up to its `li`, and `.dataset.id` tells us which song.
4. `filter` makes a new array with every song **except** that one. (That's why `songs` is `let`.)
5. Re-render from the array.

**Why it works:** the listener lives on the list, which never gets replaced, so it keeps working for songs that are drawn later. And the `data-id` connects the button on screen back to the object in the array.

**Common mistake:** adding listeners inside `createSongItem` **and** re-rendering: it works, but every render makes fresh buttons with fresh listeners, and it's easy to end up with two listeners doing the same thing. Another: deleting only the `li` (`button.closest('.song').remove()`) without changing `songs`. It disappears... until the next render brings it back, and the count is wrong.

### Q14. Like (same listener) and the updated factory

**Replace** your Q13 listener with this (one listener, two actions):

```js
playlist.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.closest('.song').dataset.id;

  if (button.dataset.action === 'delete') {
    songs = songs.filter((song) => song.id !== id);
  } else if (button.dataset.action === 'like') {
    const song = songs.find((s) => s.id === id);
    song.liked = !song.liked;
  }
  renderPlaylist();
});
```

**Update** `createSongItem`: add these two lines just before `return item;`:

```js
  item.classList.toggle('liked', song.liked);
  item.querySelector('.like').textContent = song.liked ? '♥ Liked' : '♡ Like';
```

**Step by step**
1. `find` returns the **object** in the array whose id matches.
2. `!song.liked` flips `true` ↔ `false`. Because `song` *is* the object inside the array, this changes the array.
3. `classList.toggle('liked', song.liked)` with a second argument means "add the class if this is true, remove it if false". Perfect for "the page matches the data".
4. The button text follows the same value.

**Why it works:** the factory reads `liked` from the data, so after every render the page shows the truth. Song `s2` starts liked and shows `♥ Liked` without any click.

**Common mistake:** toggling the class on the clicked `li` directly (`item.classList.toggle('liked')`) without changing the array. It looks right until any other action re-renders, then every like disappears.

### Q15. Empty state, Add, and `1 song`

Add this line at the end of `renderPlaylist()` (the `1 song` part was already in Q12):

```js
  playlistEmpty.hidden = songs.length > 0;
```

Then add the button:

```js
let nextSongNumber = 5;
let nextExtra = 0;
document.querySelector('#q15-add').addEventListener('click', () => {
  const extra = extraSongs[nextExtra % extraSongs.length];
  songs.push({ ...extra, id: `s${nextSongNumber}`, liked: false });
  nextSongNumber += 1;
  nextExtra += 1;
  renderPlaylist();
});
```

**Step by step**
1. `hidden` is a real property: `true` hides the element, `false` shows it. "Hide it when there are songs" is `songs.length > 0`.
2. `nextExtra % extraSongs.length` goes 0, 1, 0, 1, ... so it starts over when you run out.
3. `{ ...extra, id: ..., liked: false }` copies the title, artist and seconds into a **new** object and adds the new fields.
4. `nextSongNumber` only ever goes up, so ids are never reused, even after deletes.
5. Push into the array, then render. Same two steps as every other change.

**Why it works:** every change (delete, like, add) is "change the array, then render". The count, the empty message and the list all come from the same render, so they can't disagree.

**Common mistake:** making the id from the length: `` `s${songs.length + 1}` ``. Delete `s2` and add a song: the new one gets `s4`, which already exists. Now clicking Delete on one song deletes both.

---

## Tier 4: Advanced

### Q16. A nested comment thread (a function that calls itself)

```js
const commentTemplate = document.querySelector('#comment-template');

function createComment(comment) {
  const item = commentTemplate.content.cloneNode(true).querySelector('.comment');
  item.dataset.id = comment.id;
  item.querySelector('.comment-author').textContent = comment.author;
  item.querySelector('.comment-time').textContent = comment.time;
  item.querySelector('.comment-body').textContent = comment.body;

  const repliesList = item.querySelector('.replies');
  if (comment.replies.length === 0) {
    repliesList.remove();
  } else {
    comment.replies.forEach((reply) => repliesList.append(createComment(reply))); // the function calls itself
  }
  return item;
}
document.querySelector('#q16-thread').replaceChildren(...thread.map(createComment));
```

**Step by step**
1. Build one comment exactly like any other factory.
2. Find its `.replies` list. No replies? Remove the empty list (otherwise you get an empty indented box).
3. Replies? Each reply is **also** a comment, so call `createComment(reply)` and append the result into this comment's `.replies`.
4. That inner call does the same for **its** replies, and so on. It stops when a comment has `replies: []`.
5. Render the top-level comments with `map` + `replaceChildren`.

**Why it works:** this is called **recursion**. The data is shaped like a tree, so the function that draws it uses itself for each branch. It works for any depth.

**Common mistake:** `item.querySelector('.replies')` is fine, but `document.querySelector('.replies')` finds the **first** replies list on the whole page, so every reply ends up stuffed under the first comment.

### Q17. Sort and filter without changing the data

```js
const q17Sort = document.querySelector('#q17-sort');
const q17Max = document.querySelector('#q17-max');
const q17List = document.querySelector('#q17-list');

function createProductCard(product) {
  const card = productTemplate.content.cloneNode(true).querySelector('.product');
  card.querySelector('.product-name').textContent = product.name;
  card.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
  return card;
}

function renderProducts() {
  let view = [...products]; // a copy: never sort the real data
  if (q17Max.value !== '') {
    const max = Number(q17Max.value);
    view = view.filter((product) => product.price <= max);
  }
  if (q17Sort.value === 'name') {
    view.sort((a, b) => a.name.localeCompare(b.name));
  } else if (q17Sort.value === 'price-low') {
    view.sort((a, b) => a.price - b.price);
  } else {
    view.sort((a, b) => b.price - a.price);
  }
  q17List.replaceChildren(...view.map(createProductCard));
}
q17Sort.addEventListener('change', renderProducts);
q17Max.addEventListener('input', renderProducts);
renderProducts();
```

**Step by step**
1. A factory for one card (reuses `productTemplate` from Q6).
2. `[...products]` makes a **copy** of the array. The products are the data; `view` is just what to show right now.
3. Input values are always strings. Empty means "no limit". Otherwise turn it into a number and keep only cheap enough products.
4. `sort` needs a compare function. For words, `localeCompare` gives A to Z. For numbers, `a.price - b.price` is low to high; swap them for high to low.
5. Draw the view. Both controls call the same `renderProducts`.

**Why it works:** the controls describe **how to look at** the data, not changes to it. Recomputing the view from the original array every time means filters can be loosened again (clear the box and everything comes back).

**Common mistake:** `products.sort(...)` and `products = products.filter(...)`. `sort` changes the real array, and filtering it for real means a product hidden by "max $10" is **gone**: clearing the box doesn't bring it back. Also: comparing `product.price <= q17Max.value` without `Number()`. It often works by luck, but an empty box (`''`) is treated as 0, so `price <= ''` is false for everything and the list goes blank. That's why the answer checks for `''` first.

### Q18. A cart with `+` and `−`

```js
const cartList = document.querySelector('#cart');
const cartTotal = document.querySelector('#cart-total');
const cartTemplate = document.querySelector('#cart-template');

function createCartRow(entry) {
  const row = cartTemplate.content.cloneNode(true).querySelector('.cart-row');
  row.dataset.id = entry.id;
  row.querySelector('.cart-name').textContent = entry.name;
  row.querySelector('.cart-qty').textContent = entry.qty;
  row.querySelector('.cart-line').textContent = `$${(entry.price * entry.qty).toFixed(2)}`;
  return row;
}

function renderCart() {
  cartList.replaceChildren(...cart.map(createCartRow));
  let total = 0;
  cart.forEach((entry) => { total += entry.price * entry.qty; });
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

cartList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const entry = cart.find((e) => e.id === button.closest('.cart-row').dataset.id);
  if (button.dataset.action === 'inc') {
    entry.qty += 1;
  } else if (button.dataset.action === 'dec') {
    entry.qty -= 1;
    if (entry.qty === 0) cart = cart.filter((e) => e !== entry);
  }
  renderCart();
});
renderCart();
```

**Step by step**
1. The row factory works out its own line price: `price * qty`, two decimals.
2. `renderCart` draws all rows and adds up the total (24.50 + 36.00 + 15.00 = 75.50).
3. One listener: `closest` finds the button, `data-action` says which one, `data-id` on the row says which product.
4. `+` adds one. `−` takes one away, and if that reaches 0 we filter that entry out.
5. Render.

**Why it works:** the total is never stored or nudged by hand. It's recalculated from the array on every render, so it can't drift.

**Common mistake:** keeping a separate `let total` and doing `total += entry.price` in the click handler. One missed case (the row that hits 0, or a double click) and the total is wrong forever. Work it out from the data each time.

### Q19. Select a card with `closest`

```js
const q19Grid = document.querySelector('#q19-grid');
q19Grid.addEventListener('click', (event) => {
  const card = event.target.closest('.product');
  if (!card) return; // clicked the gap between cards
  q19Grid.querySelectorAll('.product').forEach((c) => c.classList.remove('selected'));
  card.classList.add('selected');
  document.querySelector('#q19-out').textContent = `Selected: ${card.dataset.name}`;
});
```

**Step by step**
1. One listener on the grid.
2. Click the emoji: `event.target` is the `<span class="emoji">`. `closest('.product')` walks up: span → h4 → **article.product**. Found.
3. Click the gap: `event.target` is the grid itself; nothing above it is a `.product`, so `closest` returns `null` and we stop.
4. Remove `selected` from every card, then add it to this one: only one is ever selected.
5. Read the name from `data-name`.

**Why it works:** `closest` turns "whatever tiny thing was clicked" into "the card it belongs to".

**Common mistake:** `event.target.classList.add('selected')`. Click the picture and the **picture** gets the outline; click the emoji and only the emoji does. And `event.target.dataset.name` is `undefined` for anything except the card itself.

### Q20. Undo the last delete

```js
let lastDeleted = null; // { note, index } or null
const q20List = document.querySelector('#q20-list');
const q20Undo = document.querySelector('#q20-undo');
const noteTemplate = document.querySelector('#note-template');

function createNoteItem(note) {
  const item = noteTemplate.content.cloneNode(true).querySelector('.note');
  item.dataset.id = note.id;
  item.querySelector('.note-text').textContent = note.text;
  return item;
}

function renderNotes() {
  q20List.replaceChildren(...notes.map(createNoteItem));
  q20Undo.disabled = lastDeleted === null;
}

q20List.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="delete"]');
  if (!button) return;
  const id = Number(button.closest('.note').dataset.id); // dataset values are strings
  const index = notes.findIndex((note) => note.id === id);
  const [removed] = notes.splice(index, 1);
  lastDeleted = { note: removed, index };
  renderNotes();
});

q20Undo.addEventListener('click', () => {
  if (lastDeleted === null) return;
  notes.splice(lastDeleted.index, 0, lastDeleted.note);
  lastDeleted = null;
  renderNotes();
});
renderNotes();
```

**Step by step**
1. `lastDeleted` remembers two things: the note **and where it was**.
2. These ids are numbers, but `dataset` always gives strings (`'2'`). `Number(...)` turns it back into `2` so `===` matches.
3. `findIndex` gives the position; `splice(index, 1)` cuts one item out there and returns it in an array, so `const [removed] = ...` takes it out.
4. Undo: `splice(index, 0, note)` cuts **nothing** and inserts the note back at that position.
5. The render function also decides whether Undo is enabled. It's part of the picture of the state.

**Why it works:** undo is just more state. If you remember enough to rebuild it, you can put it back.

**Common mistake:** `note.id === button.closest('.note').dataset.id` without `Number`. `2 === '2'` is `false`, `findIndex` returns `-1`, and `splice(-1, 1)` deletes the **last** note instead of the one you clicked.

---

## Tier 5: Applied

### Q21. Fix the unsafe reviews (XSS)

```js
const reviewTemplate = document.querySelector('#review-template');

function createReview(review) {
  const item = reviewTemplate.content.cloneNode(true).querySelector('.review');
  item.querySelector('.review-author').textContent = review.author;
  item.querySelector('.review-stars').textContent = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
  item.querySelector('.review-text').textContent = review.text; // text stays text
  return item;
}
document.querySelector('#q21-reviews').replaceChildren(...reviews.map(createReview));
```

**What to notice first:** the teammate's code builds an HTML **string** that includes text a user typed, then hands it to `innerHTML`. The browser reads the whole string as HTML, so Lee's `<img onerror="...">` becomes a real image whose `onerror` code runs. This is called **cross-site scripting (XSS)**: someone else's code running on your page, with access to everything your page can see.

**Step by step**
1. The HTML shape lives in the template, written by you, so it's trusted.
2. Every value that came from data goes in with `textContent`, which **never** parses HTML. Lee's review shows up as the literal characters `<img src="x" ...>`.
3. `'★'.repeat(2) + '☆'.repeat(3)` gives `★★☆☆☆`.

**Why it works:** templates + `textContent` keep the structure (yours) and the data (anyone's) separate. Data can't turn into code.

**Common mistake:** "fixing" it by using the template but still setting `.innerHTML = review.text` on the text paragraph. Same hole, smaller. The banner turns red again.

### Q22. Load more (append, don't re-render)

```js
const PAGE_SIZE = 4;
let shownCount = 0;
const q22List = document.querySelector('#q22-list');
const q22Status = document.querySelector('#q22-status');
const q22More = document.querySelector('#q22-more');
const eventTemplate = document.querySelector('#event-template');

function createEventItem(item) {
  const li = eventTemplate.content.cloneNode(true).querySelector('.event');
  const time = li.querySelector('.event-date');
  time.dateTime = item.date; // the datetime="" attribute
  time.textContent = item.date;
  li.querySelector('.event-name').textContent = item.name;
  return li;
}

function showMore() {
  const nextBatch = upcoming.slice(shownCount, shownCount + PAGE_SIZE);
  q22List.append(...nextBatch.map(createEventItem)); // append: keep what is already shown
  shownCount += nextBatch.length;
  q22Status.textContent = `Showing ${shownCount} of ${upcoming.length}`;
  q22More.hidden = shownCount >= upcoming.length;
}
q22More.addEventListener('click', showMore);
showMore();
```

**Which technique?** This is the one place where you **don't** clear and redraw. The items already shown haven't changed; you're only adding more. So `append`, not `replaceChildren`.

**Step by step**
1. `shownCount` remembers how far we've got.
2. `slice(start, end)` copies a piece of the array without changing it: items 0-3, then 4-7, then 8-9 (the last batch has only 2, and `slice` doesn't mind).
3. Append the new batch, then add **how many we actually added** (`nextBatch.length`, not always 4).
4. Hide the button when everything is shown.
5. `time.dateTime` is the property for the `datetime` attribute (note the capital T), which tells browsers and search engines the machine-readable date.
6. Call `showMore()` once at the start for the first page.

**Common mistake:** `shownCount += PAGE_SIZE`. After the third click it says `Showing 12 of 10`. Also: using `replaceChildren` with only the new batch: the first 4 vanish when you click.

### Q23. Table rows from a template

```js
const rowTemplate = document.querySelector('#row-template');
const q23Body = document.querySelector('#q23-table tbody');

function describeTemp(temp) {
  if (temp < 0) return 'Cold';
  if (temp <= 15) return 'Mild';
  return 'Warm';
}

function createWeatherRow(entry) {
  const row = rowTemplate.content.cloneNode(true).querySelector('tr');
  row.querySelector('.city').textContent = entry.city;
  row.querySelector('.temp').textContent = `${entry.temp} °C`;
  row.querySelector('.feel').textContent = describeTemp(entry.temp);
  row.classList.toggle('cold', entry.temp < 0);
  return row;
}
q23Body.replaceChildren(...weather.map(createWeatherRow));
// Why a <template>? The HTML parser only allows <tr> inside a table.
// Inside a <div>, the browser throws the <tr> and <td> tags away and keeps only the text.
// A <template> is allowed to hold any piece of HTML, including a lone <tr>.
```

**Step by step**
1. A small helper turns a number into a word. Checking in order (below 0, then up to 15, then the rest) keeps each test simple.
2. The factory pulls the `<tr>` out of the clone and fills each cell.
3. `classList.toggle('cold', entry.temp < 0)` adds the class only for below-zero rows.
4. Append the rows into the `tbody`, not the `table`.

**Why it works:** a template is the only element that can hold "half a table". That's a big reason templates exist.

**Common mistake:** appending rows to `#q23-table` instead of its `tbody`. They end up **after** the `tbody`; it may look fine, but your header/body structure is wrong. And if you try `document.createElement('div')` + `innerHTML = '<tr>...'`, you'll find the `<tr>` simply isn't there.

### Q24. A two-column board, one listener

```js
const taskTemplate = document.querySelector('#task-template');
const q24Todo = document.querySelector('#q24-todo');
const q24Done = document.querySelector('#q24-done');

function createTaskItem(task) {
  const item = taskTemplate.content.cloneNode(true).querySelector('.task');
  item.dataset.id = task.id;
  item.querySelector('.task-text').textContent = task.text;
  item.querySelector('button').textContent = task.status === 'todo' ? 'Done ✓' : 'Undo ↺';
  return item;
}

function renderBoard() {
  const todo = tasks.filter((task) => task.status === 'todo');
  const done = tasks.filter((task) => task.status === 'done');
  q24Todo.replaceChildren(...todo.map(createTaskItem));
  q24Done.replaceChildren(...done.map(createTaskItem));
  document.querySelector('#q24-todo-count').textContent = todo.length;
  document.querySelector('#q24-done-count').textContent = done.length;
}

document.querySelector('#q24-board').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="move"]');
  if (!button) return;
  const task = tasks.find((t) => t.id === button.closest('.task').dataset.id);
  task.status = task.status === 'todo' ? 'done' : 'todo';
  renderBoard();
});
renderBoard();
```

**Which technique?** It's tempting to *move* the `li` from one list to the other with `append`. But then the button text and both counts need fixing by hand too. One array with a `status`, and one render that splits it, gets everything right at once.

**Step by step**
1. One array; each task knows its own `status`.
2. `renderBoard` filters the array twice and draws each column. The counts are just the lengths.
3. The listener sits on the board, the parent of **both** lists, so one listener covers both columns.
4. Flip the status, render.

**Common mistake:** two listeners (one per column) that each append the `li` to the other list. It works for one click; then the button still says `Done ✓` in the Done column and the counts never change.

### Q25. Live search directory

```js
const personTemplate = document.querySelector('#person-template');
const q25Search = document.querySelector('#q25-search');
const q25List = document.querySelector('#q25-list');
const q25Status = document.querySelector('#q25-status');
const q25Empty = document.querySelector('#q25-empty');

function createPersonItem(person) {
  const item = personTemplate.content.cloneNode(true).querySelector('.person');
  item.querySelector('.person-name').textContent = person.name;
  item.querySelector('.person-role').textContent = person.role;
  const email = item.querySelector('.person-email');
  email.textContent = person.email;
  email.href = `mailto:${person.email}`;
  return item;
}

function renderTeam() {
  const raw = q25Search.value.trim();
  const term = raw.toLowerCase();
  const matches = team.filter((person) =>
    person.name.toLowerCase().includes(term) || person.role.toLowerCase().includes(term));
  q25List.replaceChildren(...matches.map(createPersonItem));
  q25Status.textContent = `Showing ${matches.length} of ${team.length}`;
  q25Empty.hidden = matches.length > 0;
  q25Empty.textContent = matches.length > 0 ? '' : `No one matches "${raw}".`;
}
q25Search.addEventListener('input', renderTeam);
renderTeam();
```

**Which technique?** You could hide and show existing `li`s with a class. But you also need a count and an empty message, and the list needs to be built in the first place. A "filter, then render" function does all of it, and it's the same shape as Q17.

**Step by step**
1. The factory builds one person; `mailto:` in front of the address makes the link open an email.
2. Lower-case **both** sides, so `DEV`, `dev` and `Dev` all match `Front-end developer`.
3. `includes('')` is `true` for every string, so an empty search box shows everyone. No special case needed.
4. Render the matches, the count and the empty message. Keep `raw` (what they typed) for the message, so it shows their words, not the lower-cased version.
5. `input` fires on every keystroke, paste or delete.

**Common mistake:** writing the empty message with a template literal into `innerHTML`. Anything typed in the search box would be parsed as HTML: the same XSS hole as Q21, from your own search box. `textContent` keeps it safe.

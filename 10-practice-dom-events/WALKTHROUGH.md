# Day 15 practice: walkthrough and answers

Try each question on your own first. Then come here to check.

Every answer below was tested in a real browser against `index.html`. You can paste all of them into one `main.js`, one after the other. The only exception is Q18: it **replaces** Q17.

Each question has four parts:
- **Answer:** the code
- **Step by step:** what each line does
- **Why it works**
- **Common mistake**

---

## Tier 1: Easy

### Q1. Change the title (select by id)

```js
const title = document.querySelector('#page-title');
title.textContent = 'My Practice Page';
```

**Step by step**
1. `document.querySelector('#page-title')` looks through the page for the element with the id `page-title`. The `#` means "id".
2. You save it in a `const` called `title`, so you can use it again.
3. `title.textContent = ...` swaps the words inside the heading for new ones.

**Why it works:** `querySelector` uses the same selectors as CSS. In CSS, `#page-title` means "the thing with this id". So JavaScript finds the same thing.

**Common mistake:** writing `querySelector('page-title')` without the `#`. That looks for a tag called `<page-title>`, finds nothing and gives you `null`. Then the next line crashes with "Cannot set properties of null".

### Q2. Change the subtitle (select by class)

```js
const subtitle = document.querySelector('.subtitle');
subtitle.textContent = 'Learning the DOM one step at a time';
```

**Step by step**
1. `.subtitle` with a dot means "the class `subtitle`".
2. `querySelector` gives you the **first** element with that class.
3. You set its `textContent` to the new sentence.

**Why it works:** a dot in a selector means class, just like in CSS.

**Common mistake:** forgetting the dot (`'subtitle'`), or using `#subtitle`. This paragraph has a class, not an id.

### Q3. Change the footer (select by element)

```js
const footer = document.querySelector('footer');
footer.textContent = 'Made by: Iles';
```

**Step by step**
1. `'footer'` has no `#` and no dot. That means "find a tag called `<footer>`".
2. You change its text to `Made by: ` and your name.

**Why it works:** a plain word in a selector is a tag name, like `p`, `h2`, `li` or `footer`.

**Common mistake:** using a tag that appears many times, like `'p'`. You'd only get the **first** `<p>` on the page, which may not be the one you wanted.

### Q4. Greeting with a template literal

```js
const greeting = document.querySelector('#greeting');
const myName = 'Sam';
greeting.textContent = `Hello, ${myName}! Welcome to class.`;
```

**Step by step**
1. Find `#greeting`.
2. Make a `const` called `myName` that holds a name.
3. Build the sentence with **backticks** (`` ` ``). `${myName}` drops the name right into the sentence.
4. Put that sentence into the paragraph with `textContent`.

**Why it works:** inside backticks, `${ }` means "work this out and put the result here".

**Common mistake:** using normal quotes `'Hello, ${myName}!'`. Then you'd literally see `${myName}` on the page. Only backticks fill in `${ }`.

(Why `myName` and not `name`? `name` already means something on `window`, so `myName` is a safer choice.)

### Q5. Change one style

```js
const intro = document.querySelector('#intro');
intro.style.backgroundColor = 'lightyellow';
```

**Step by step**
1. Find the `#intro` section.
2. `.style.backgroundColor` is that element's background colour. Set it to `'lightyellow'`.

**Why it works:** `.style` changes the element's own CSS. CSS names with a dash become **camelCase** in JavaScript: `background-color` becomes `backgroundColor`.

**Common mistake:** writing `style.background-color`. JavaScript reads the dash as a minus sign, so it breaks.

---

## Tier 2: A little harder

### Q6. Count the items (`querySelectorAll` and `.length`)

```js
const items = document.querySelectorAll('.item');
const itemCount = document.querySelector('#item-count');
itemCount.textContent = `There are ${items.length} items.`;
```

**Step by step**
1. `querySelectorAll('.item')` gets **every** element with the class `item`. You get back a list, called a NodeList.
2. `items.length` is how many are in that list (5).
3. A template literal puts that number into the sentence.

**Why it works:** `querySelector` gives **one** element. `querySelectorAll` gives **all** of them in a list, and every list has a `.length`.

**Common mistake:** using `querySelector('.item').length`. That's one element, not a list, so `.length` is `undefined`.

### Q7. Change them all with `forEach`

```js
const notes = document.querySelectorAll('.note');
notes.forEach((note) => {
  note.style.color = 'navy';
});
```

**Step by step**
1. Get all the `.note` paragraphs as a list.
2. `forEach` runs your arrow function once for each paragraph. Each time, `note` is the paragraph it's on.
3. Make that paragraph's text navy.

**Why it works:** `forEach` visits every item in the list, so the change happens to all of them.

**Common mistake:** writing `notes.style.color = 'navy'`. A list doesn't have a `.style`. Only each element inside it does, so you have to loop.

### Q8. Descendant, nth-child and attribute selectors

```js
// a) Descendant: every .sale item inside #products
const saleItems = document.querySelectorAll('#products .sale');
saleItems.forEach((item) => {
  item.style.color = 'red';
});

// b) nth-child: the 3rd <li> in #products
const third = document.querySelector('#products li:nth-child(3)');
third.style.fontWeight = 'bold';

// c) Attribute: the element with data-role="tip"
const tip = document.querySelector('[data-role="tip"]');
tip.textContent = 'Tip: attribute selectors use square brackets.';
```

**Step by step**
1. **a)** `'#products .sale'` has a **space** in it. That means "a `.sale` that is somewhere inside `#products`". Loop over them and make each one red.
2. **b)** `'#products li:nth-child(3)'` means "the `li` that is child number 3". Counting starts at 1. Make it bold.
3. **c)** `'[data-role="tip"]'` uses square brackets. That means "the element whose attribute `data-role` equals `tip`". Change its text.

**Why it works:** these are all CSS selectors. Anything you can select in CSS, you can select with `querySelector`.

**Common mistakes:**
- Writing `'#products.sale'` with no space. That means "an element that is `#products` **and** has class `sale`", which doesn't exist.
- Counting `nth-child` from 0. It starts at 1.

### Q9. `classList`: add, remove, toggle

```js
const important = document.querySelector('.important');
important.classList.add('highlight');

const banner = document.querySelector('#banner');
banner.classList.remove('hidden');

const products = document.querySelector('#products');
products.classList.toggle('boxed');
```

**Step by step**
1. `add('highlight')` puts the class on. The CSS for `.highlight` makes the background yellow.
2. `remove('hidden')` takes the class off the banner, so `display: none` no longer applies and you can see it.
3. `toggle('boxed')` adds the class if it's missing, or takes it off if it's there.

**Why it works:** the looks live in CSS classes. JavaScript just switches the classes on and off.

**Common mistake:** writing `classList.add('.highlight')` with a dot. Here you give the class **name**, not a selector, so there's no dot.

### Q10. Make a new element (`createElement` and `append`)

```js
const output = document.querySelector('#output');
const para = document.createElement('p');
para.textContent = 'I was made by JavaScript!';
output.append(para);
```

**Step by step**
1. Find the empty `#output` box.
2. `document.createElement('p')` makes a new `<p>`. It isn't on the page yet.
3. Give it some text with `textContent`.
4. `output.append(para)` puts it inside `#output`. Now you can see it.

**Why it works:** making an element and placing it are two separate steps. `append` adds it as the last child.

**Common mistake:** forgetting `append`. The paragraph gets made, but it never shows up because it was never put on the page.

---

## Tier 3: Simple events

### Q11. Click changes text

```js
const helloBtn = document.querySelector('#btn-hello');
const helloText = document.querySelector('#hello-text');

helloBtn.addEventListener('click', () => {
  helloText.textContent = 'You clicked the button!';
});
```

**Step by step**
1. Find the button and the paragraph.
2. `addEventListener('click', () => { ... })` says: "when this button is clicked, run this code".
3. Inside, change the paragraph's text.

**Why it works:** the arrow function doesn't run straight away. The browser saves it and runs it **each time** the click happens.

**Common mistake:** writing `addEventListener('onclick', ...)`. The event name is just `'click'`, with no "on".

### Q12. Click toggles a class (dark mode)

```js
const themeBtn = document.querySelector('#btn-theme');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
```

**Step by step**
1. Find the button.
2. On each click, `document.body.classList.toggle('dark')` flips the `dark` class on the `<body>`.
3. The `.dark` CSS makes the background dark and the text light.

**Why it works:** `toggle` remembers nothing itself. It just checks whether the class is there right now and does the opposite.

**Common mistake:** using `add` instead of `toggle`. Then dark mode turns on but never turns off.

### Q13. Highlight on hover (`mouseenter` and `mouseleave`)

```js
const productItems = document.querySelectorAll('#products .item');

productItems.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    item.classList.add('highlight');
  });
  item.addEventListener('mouseleave', () => {
    item.classList.remove('highlight');
  });
});
```

**Step by step**
1. Get all the product items.
2. Loop over them, and give **each** item two listeners.
3. `mouseenter` (the mouse moves onto it) adds `highlight`.
4. `mouseleave` (the mouse moves off it) removes `highlight`.

**Why it works:** each item gets its own listeners, and inside them `item` means **that** item. So only the one under the mouse lights up.

**Common mistake:** putting a listener on the list you got from `querySelectorAll` (`productItems.addEventListener`). A list can't listen. You have to loop and add a listener to each element.

### Q14. Live preview (`input` event)

```js
const nameInput = document.querySelector('#name-input');
const preview = document.querySelector('#preview');

nameInput.addEventListener('input', () => {
  preview.textContent = `Hi, ${nameInput.value}!`;
});
```

**Step by step**
1. Find the text box and the preview paragraph.
2. The `input` event fires on **every** keystroke, paste or delete.
3. Each time, read `nameInput.value` (what's in the box right now) and show it in the preview.

**Why it works:** `.value` is always the current text in the box, so the preview always matches.

**Common mistake:** reading `nameInput.textContent`. Text boxes keep what you typed in `.value`, not `textContent`.

### Q15. `change` on a checkbox and a select

```js
// a) The checkbox
const agree = document.querySelector('#agree');
const agreeStatus = document.querySelector('#agree-status');

agree.addEventListener('change', () => {
  if (agree.checked) {
    agreeStatus.textContent = 'Agreed';
  } else {
    agreeStatus.textContent = 'Not agreed';
  }
});

// b) The select
const size = document.querySelector('#size');
const sizeStatus = document.querySelector('#size-status');

size.addEventListener('change', () => {
  sizeStatus.textContent = `You picked ${size.value}`;
});
```

**Step by step**
1. **a)** The checkbox fires `change` when it is ticked or unticked.
2. `agree.checked` is `true` when it is ticked and `false` when it isn't. Use `if` to pick the right words.
3. **b)** The dropdown fires `change` when you pick a new option.
4. `size.value` is the `value` of the option you picked, like `large`. Put it in a template literal.

**Why it works:** `change` fires once, when the choice is made. That's perfect for checkboxes and dropdowns.

**Common mistake:** reading `agree.value` for a checkbox. It's always `"on"`, whether it's ticked or not. Use `.checked`.

---

## Tier 4: More complex

### Q16. Counter with + and −

```js
const minusBtn = document.querySelector('#btn-minus');
const plusBtn = document.querySelector('#btn-plus');
const countSpan = document.querySelector('#count');

let count = 0;

plusBtn.addEventListener('click', () => {
  count = count + 1;
  countSpan.textContent = count;
});

minusBtn.addEventListener('click', () => {
  count = count - 1;
  countSpan.textContent = count;
});
```

**Step by step**
1. Find both buttons and the number.
2. `let count = 0;` uses `let` because the number will change.
3. The `+` click adds 1 to `count`, then shows it.
4. The `−` click takes 1 away, then shows it.

**Why it works:** `count` lives **outside** the listeners, so it remembers its value between clicks.

**Common mistake:** putting `let count = 0;` **inside** the click function. Then it starts again at 0 on every click and only ever shows 1 or -1.

### Q17. Press Enter to add a to-do

```js
const newItem = document.querySelector('#new-item');
const todoList = document.querySelector('#todo-list');

newItem.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;      // only care about Enter

  const text = newItem.value.trim();
  if (text === '') return;                // ignore empty items

  const li = document.createElement('li');
  li.textContent = text;
  todoList.append(li);

  newItem.value = '';                     // clear the box
  newItem.focus();                        // ready for the next one
});
```

**Step by step**
1. Listen for `keydown` on the text box. It fires for **every** key.
2. `event.key` tells you which key it was. If it isn't `'Enter'`, `return` stops right there.
3. `.trim()` cuts the spaces off both ends.
4. If what's left is empty, `return` again, so nothing gets added.
5. Make an `li`, put the text in it and append it to the list.
6. Clear the box with `value = ''`, then `focus()` puts the cursor back in it.

**Why it works:** each `return` is a "stop here" gate. Only a real Enter press with real text gets past both gates.

**Common mistake:** forgetting `.trim()`. Then pressing Enter on a box full of spaces still adds a blank item.

### Q18. Each item gets a ✕ remove button

This **replaces** Q17. Delete your Q17 code first, or every Enter would add two items.

```js
const newItem = document.querySelector('#new-item');
const todoList = document.querySelector('#todo-list');

function buildItem(text) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = text;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = '✕';
  removeBtn.setAttribute('aria-label', `Remove ${text}`);
  removeBtn.addEventListener('click', () => {
    li.remove();                          // remove THIS item
  });

  li.append(span, removeBtn);
  return li;
}

newItem.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;

  const text = newItem.value.trim();
  if (text === '') return;

  todoList.append(buildItem(text));
  newItem.value = '';
  newItem.focus();
});
```

**Step by step**
1. `buildItem(text)` is a small function that builds one whole item and gives it back.
2. Inside it, make the `li`, a `span` for the words and a `button` showing `✕`.
3. Give the button a click listener that runs `li.remove()`.
4. Put the span and the button inside the `li` with `append`, then `return` the `li`.
5. The Enter code is the same as Q17, except it appends `buildItem(text)`.

**Why it works:** every time `buildItem` runs, it makes a **new** `li` and a **new** button. Each button's listener remembers its own `li`. So the ✕ always removes the right one.

**Common mistake:** adding the remove listeners just once at the top of the file with `querySelectorAll('#todo-list button')`. The new buttons didn't exist yet back then, so they never get a listener. Add the listener when you make the button.

### Q19. Show and hide a panel

```js
const panelBtn = document.querySelector('#btn-panel');
const panel = document.querySelector('#panel');

panelBtn.addEventListener('click', () => {
  panel.classList.toggle('hidden');

  if (panel.classList.contains('hidden')) {
    panelBtn.textContent = 'Show details';
  } else {
    panelBtn.textContent = 'Hide details';
  }
});
```

**Step by step**
1. On click, `toggle('hidden')` shows the panel or hides it.
2. Then ask: `panel.classList.contains('hidden')`. Is it hidden now?
3. If it's hidden, the button should offer to **show** it. If not, the button should offer to **hide** it.

**Why it works:** you check the class **after** toggling, so the button text always matches what you can see.

**Common mistake:** getting the words backwards. When the panel is hidden, the button should say "Show details", because that is what clicking it will do.

### Q20. Check a form on submit (`preventDefault` and `nextElementSibling`)

```js
const signupForm = document.querySelector('#signup-form');
const email = document.querySelector('#email');
const message = email.nextElementSibling;   // the <span class="message">

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();                   // stay on the page

  const value = email.value.trim();

  if (!value.includes('@')) {
    message.textContent = 'Your email needs an @ sign.';
    message.className = 'message error';
  } else {
    message.textContent = 'Thanks for signing up!';
    message.className = 'message ok';
  }
});
```

**Step by step**
1. `email.nextElementSibling` is the element right after the input in the HTML. That's the `<span class="message">`.
2. Listen for `submit` on the **form** (not the button).
3. `event.preventDefault()` stops the page from reloading.
4. Trim what was typed. `includes('@')` checks for an `@`.
5. Show the right message and set its class to `error` or `ok`.

**Why it works:** a form's normal job is to send the data away and load a new page. `preventDefault` cancels that, so your code can handle it instead.

**Common mistake:** forgetting `event.preventDefault()`. The message flashes for a split second and then disappears when the page reloads.

---

## Tier 5: Applied

### Q21. Like button that counts

```js
const likeBtn = document.querySelector('#btn-like');
let likes = 0;

likeBtn.addEventListener('click', () => {
  likes = likes + 1;
  likeBtn.textContent = `♥ Like (${likes})`;
  likeBtn.classList.add('liked');
});
```

**Step by step**
1. Keep a `let likes = 0;` outside the click.
2. Each click adds 1 to `likes` and puts the new number in the button text.
3. `classList.add('liked')` turns the button pink. Adding it again does nothing, so that's fine.

**Why it works:** it's the counter from Q16, except the button shows its own number.

**Common mistake:** trying to read the number back out of the button text. Keeping it in a variable is much easier.

### Q22. Character counter

```js
const bio = document.querySelector('#bio');
const charCount = document.querySelector('#char-count');
const MAX = 50;

bio.addEventListener('input', () => {
  const length = bio.value.length;
  charCount.textContent = `${length} / ${MAX}`;
  charCount.classList.toggle('warning', length > MAX);
});
```

**Step by step**
1. Listen for `input`, so the counter updates on every key.
2. `bio.value.length` is how many characters are in the box.
3. Show it with a template literal, like `12 / 50`.
4. `toggle('warning', length > MAX)`: the second part decides. `true` means add the class, `false` means remove it.

**Why it works:** `toggle` with a `true`/`false` second part is a quick way to say "have this class only when this is true".

**Common mistake:** only using `add('warning')`. Then the counter stays red even after you delete text and go back under 50.

### Q23. Filter a list as you type

```js
const search = document.querySelector('#search');
const fruits = document.querySelectorAll('#fruit-list li');

search.addEventListener('input', () => {
  const words = search.value.trim().toLowerCase();

  fruits.forEach((fruit) => {
    const name = fruit.textContent.toLowerCase();
    const matches = name.includes(words);
    fruit.classList.toggle('hidden', !matches);
  });
});
```

**Step by step**
1. Get the search box and all the fruits.
2. On every `input`, read the box and make it lower case.
3. For each fruit, make its name lower case too, then check `includes(words)`.
4. Hide the fruits that don't match: `toggle('hidden', !matches)`.

**Why it works:** lower-casing **both** sides means `AP`, `ap` and `Ap` all match `Apple`. Every word includes the empty string `''`, so an empty box shows everything.

**Common mistake:** only lower-casing one side. Then typing `ap` won't find `Apple`, because `"Apple".includes("ap")` is `false`.

### Q24. Shopping list with a total

```js
const cartForm = document.querySelector('#cart-form');
const cartName = document.querySelector('#cart-name');
const cartPrice = document.querySelector('#cart-price');
const cart = document.querySelector('#cart');
const totalText = document.querySelector('#total');

let total = 0;

cartForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = cartName.value.trim();
  const price = Number(cartPrice.value);

  if (name === '' || cartPrice.value === '' || price <= 0) return;  // skip bad input

  const li = document.createElement('li');
  li.textContent = `${name}: $${price.toFixed(2)}`;
  cart.append(li);

  total = total + price;
  totalText.textContent = `Total: $${total.toFixed(2)}`;

  cartName.value = '';
  cartPrice.value = '';
  cartName.focus();
});
```

**Step by step**
1. Keep a `let total = 0;` outside the submit listener.
2. On submit, call `preventDefault()` first.
3. Read the name (trimmed) and turn the price into a number with `Number(...)`.
4. If the name is empty, the price box is empty or the price is 0 or less, `return` and add nothing.
5. Make an `li` like `Milk: $3.50`. `toFixed(2)` always shows two decimal places.
6. Add the price to `total` and show the new total.
7. Clear both boxes and put the cursor back in the name box.

**Why it works:** `.value` is always **text**, even in a number box. `Number()` turns it into a real number, so adding works.

**Common mistake:** writing `total = total + cartPrice.value`. That glues text together: `0` + `"3.5"` gives `"03.5"`. Always use `Number()` first.

(The `$${...}` looks odd. The first `$` is just a dollar sign on the page. `${` starts the fill-in part.)

### Q25. Colour picker changes the page

```js
const picker = document.querySelector('#color-picker');
const colorValue = document.querySelector('#color-value');

picker.addEventListener('input', () => {
  document.body.style.backgroundColor = picker.value;
  colorValue.textContent = picker.value;
});
```

**Step by step**
1. Listen for `input` on the colour picker. It fires while you drag around the colours.
2. `picker.value` is the colour code, like `#ffcc00`.
3. Set `document.body.style.backgroundColor` to that colour, and show the code in `#color-value`.

**Why it works:** a colour picker's `.value` is a colour code that CSS already understands, so you can use it as-is.

**Common mistake:** using `'change'` and then wondering why the page only changes when the picker closes. `input` updates live, while `change` waits until you're done.

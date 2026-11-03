# Day 19 practice: walkthrough and answers

Try each question on your own first. Then come here to check.

Every fix below was tested in Microsoft Edge (the same engine as Chrome) against this exact page, served over `http://127.0.0.1`. The error messages are copied from that browser. Your line numbers will match as long as you haven't added lines above the bug. (If you add a line, everything below it moves down by one. That's normal.)

Each question has these parts:
- **Answer:** the fact you should have found, or the fixed code
- **Step by step:** what to click, what to look at, and what each line does
- **Why it works**
- **Common mistake**

A quick map of DevTools before you start:

| Panel | Answers the question |
|---|---|
| **Elements** | What does the page look like *right now* (live DOM)? Which CSS applies? Which listeners are attached? |
| **Console** | What went wrong (errors)? What is this value? Let me try one line. |
| **Sources** | Pause the code. What are the variables at this exact moment? Which function called which? |
| **Network** | What did the browser ask the server for, and what came back? |
| **Application** | What's saved in `localStorage` (and cookies, etc.)? |

---

## Tier 1: Simple

### Q1. Open DevTools three ways

**Answer**
- Keyboard: **F12**, or **Ctrl+Shift+I** (Windows) / **Cmd+Option+I** (Mac). **Ctrl+Shift+J** / **Cmd+Option+J** opens straight to the Console.
- Menu: the **⋮** (Chrome) or **…** (Edge) menu → **More tools → Developer tools**.
- Right-click → **Inspect**: opens the **Elements** panel with the element you right-clicked (the `<h2>Menu</h2>`) already **selected and highlighted**.

**Step by step**
1. Press F12. DevTools opens, docked to the side or bottom of the window. The panel it shows is whichever you used last.
2. Close it (F12 again) and open it from the menu.
3. Right-click the word **Menu** and choose **Inspect**. In the Elements panel, the line `<h2>Menu</h2>` is highlighted in blue, and hovering over it highlights the heading on the page.

**Why it works:** Inspect means "show me the code for *this thing*". It's the fastest way to jump from what you see to the HTML behind it.

**Common mistake:** on a Mac laptop, F12 may be a volume key. Use **Cmd+Option+I**, or hold **fn** with F12.

### Q2. The id of the specials heading

**Answer:** `special-heading`

**Step by step**
1. Right-click **Today's specials** → **Inspect**.
2. The selected line is `<h2 id="special-heading">Today's specials</h2>`. The attribute `id="special-heading"` is shown in a different colour from the tag name.

**Why it works:** the Elements panel shows every attribute of every element. You never need to dig through the HTML file to find an id or class.

**Common mistake:** reporting the text (`Today's specials`) or the tag (`h2`) instead of the id. The id is what you'd use in `querySelector('#special-heading')`.

### Q3. The page title and a quick count

**Answer:** `'Campus Café: DevTools practice'` and `6`.

**Step by step**
1. Open the **Console** panel (or press **Esc** in any panel to open the Console drawer at the bottom).
2. Type `document.title` and press Enter. The Console prints the value of that expression: the text from the `<title>` tag.
3. Type `document.querySelectorAll('.menu-item').length`. It prints `6`.

**Why it works:** the Console is a JavaScript prompt that runs **inside this page**. Anything your code could ask (`document`, `querySelector`, variables on `window`), you can ask by hand.

**Common mistake:** expecting the Console to remember things you type across reloads. Each reload is a fresh page.

### Q4. Fix the typo (`bugs/q04.js`)

**The error**

```
Uncaught ReferenceError: consol is not defined
    at q04.js:5
```

**Answer**

```js
const output = document.querySelector('#q4-output');

console.log('Q4 loaded');
output.textContent = 'Q4 is working!';
```

**Step by step**
1. Find the red message with `q04.js:5` on the right. Click `q04.js:5`: the Sources panel opens with line 5 highlighted.
2. Read the message: **`consol` is not defined** means "you used a name (`consol`) that JavaScript has never heard of".
3. Line 5 is `consol.log('Q4 loaded');`. The name should be `console`.
4. Fix it, save. The page reloads, the box says **Q4 is working!** and the Console shows `Q4 loaded`.

**Why it works:** `ReferenceError: X is not defined` almost always means a typo in a name, a variable used before it was created, or a variable created inside a different function.

**Common mistake:** wondering why line 6 didn't run either. When a line throws an error, **the rest of that file stops**. That's why the box still said "Q4 is broken."

### Q5. `$0` and `$()`

**Answer:** `$0.textContent` prints `'$3.25'`. `$('.badge--sale').textContent` prints `'On sale'`. `$()` is the Console's shortcut for `document.querySelector()`.

**Step by step**
1. In Elements, expand the Muffin `<li>` and click `<span class="price">$3.25</span>`. DevTools shows `== $0` next to it: that's a hint that `$0` now means this element.
2. In the Console, `$0` is "the element currently selected in Elements". `$0.textContent` reads its text.
3. `$('.badge--sale')` finds the first element matching that selector, exactly like `document.querySelector('.badge--sale')`.

**Why it works:** these are **Console-only helpers**. `$0` saves you writing a selector for something you can click. `$1` is the element you selected before that. `$$('.menu-item')` is like `querySelectorAll` but gives back a real array.

**Common mistake:** using `$0` or `$()` in your `main.js`. They exist only in the DevTools Console, not in your page's code. (If a page uses jQuery, `$` means jQuery instead.)

## Tier 2: Easy

### Q6. Live edit, then reload

**Answer:** the heading changes on the screen straight away. After a reload, it says **Campus Café** again, because DevTools edited the browser's **live copy** of the page (the DOM), not your `index.html` file.

**Step by step**
1. Inspect the heading. Double-click the text inside `<h1 id="cafe-name">`. It becomes editable.
2. Type a new name and press Enter. The page updates instantly.
3. Reload: the browser downloads `index.html` again and builds a fresh DOM from it.

**Why it works:** the DOM is the browser's working copy of the page in memory. DevTools and JavaScript both edit that copy. Your files only change when you edit them in VS Code.

**Common mistake:** fixing a layout perfectly in DevTools, closing the tab, and losing all of it. When an experiment works, **copy the change into your file**. (Tip: in the Styles pane you can click a property to see exactly what to copy.)

### Q7. The sale badge's styles

**Answer**
- a) `background: #dc2626` (red), from the rule `.badge--sale` at `styles.css:38`. DevTools shows the colour as a small red square; the Computed tab shows it as `rgb(220, 38, 38)`.
- b) `background: #dbeafe` in the `.badge` rule (`styles.css:31`) is **crossed out**. Both rules match the element and have the same specificity (one class each), so the one that comes **later** in the file wins: `.badge--sale`.
- c) With `badge--sale` switched off, the badge turns pale blue with dark blue text, like the **New** badge.

**Step by step**
1. Right-click **On sale** → Inspect. The Styles pane (right side of Elements) lists every rule that matches, most important at the top.
2. Read the top rule: `.badge--sale { background: #dc2626; color: #ffffff; }`, with the file and line on the right.
3. Further down is `.badge { ... background: #dbeafe; color: #1e3a8a; }`, with those two lines struck through. A line through a property means "this rule matched, but something else won".
4. Click **`.cls`** at the top of the Styles pane. You'll see a checkbox for each class on the element. Untick `badge--sale`.

**Why it works:** the Styles pane is the browser explaining its CSS decisions. Crossed-out = lost. Missing entirely = the selector doesn't match at all.

**Common mistake:** thinking a crossed-out property is an error in your CSS. It isn't: it just lost to a more specific or later rule.

### Q8. Assignment to constant variable (`bugs/q08.js`)

**The error** (on every click, not on load)

```
Uncaught TypeError: Assignment to constant variable.
    at HTMLButtonElement.<anonymous> (q08.js:8)
```

**Answer**

```js
const button = document.querySelector('#q8-button');
const output = document.querySelector('#q8-output');

let clicks = 0;

button.addEventListener('click', () => {
  clicks = clicks + 1;
  output.textContent = `Clicked ${clicks} times`;
});
```

**Step by step**
1. Load the page: no error from `q08.js` yet. Click the button: now the error appears. The error happens when the **listener** runs, not when the file loads. The stack trace says so: `HTMLButtonElement.<anonymous>` means "an unnamed function that a button called" (your click listener).
2. Click `q08.js:8`. Line 8 is `clicks = clicks + 1;`. You're giving `clicks` a new value.
3. Look up to where `clicks` was created: line 5, `const clicks = 0;`. A `const` can never be given a new value.
4. Change `const` to `let`.

**Why it works:** use `const` by default, and `let` only for variables you will **reassign** (counters, totals, running scores).

**Common mistake:** changing line 8 instead (for example to `const clicks = clicks + 1`). That makes a new variable inside the listener and gives a different error. The problem is the *declaration* on line 5.

### Q9. `null` and `addEventListener` (`bugs/q09.js`)

**The error** (on load)

```
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
    at q09.js:5
```

**Answer**

```js
const orderButton = document.querySelector('#order-button');
const orderOutput = document.querySelector('#q9-output');

orderButton.addEventListener('click', () => {
  orderOutput.textContent = 'Order placed!';
});
```

**Step by step**
1. Read the message slowly: "Cannot read properties **of null** (reading **'addEventListener'**)". The thing *in front of* `.addEventListener` is `null`. On line 5 that's `orderButton`.
2. So `orderButton` is `null`. Where did it come from? Line 2: `document.querySelector('#order-btn')`. `querySelector` returns `null` when nothing matches.
3. Test the guess in the Console: `document.querySelector('#order-btn')` gives `null`. Now inspect the button on the page: `<button type="button" id="order-button">`. The id is `order-button`.
4. Fix the selector. Test in the Console first: `document.querySelector('#order-button')` gives the button.

**Why it works:** this is the most common front-end error there is. It has three usual causes: (1) a typo in the selector, (2) a missing `#` or `.`, (3) the script ran **before** the HTML existed (no `defer`). Here it's (1). The modules on this page are deferred automatically, so it can't be (3).

**Common mistake:** "fixing" it by wrapping the line in `if (orderButton)`. That hides the error but the button still doesn't work.

### Q10. `console.table`

**Answer**
- a) **Cookie** ($1.50).
- b) **3** drinks: Coffee, Tea, Smoothie.
- c) The table sorts by that column. Click again to reverse.

**Step by step**
1. `console.table(cafeMenu)` draws the array as a table: one row per object, one column per property (`name`, `price`, `category`), plus an `(index)` column.
2. Click the `price` heading to sort; the cheapest is at the top.
3. Click `category` to group the drinks together, and count.

**Why it works:** `console.log` of an array of objects shows a collapsed line you have to click open. `console.table` is much easier to read when every item has the same properties, which is exactly what you'll get back from an API next week.

**Common mistake:** typing `console.table(menu)`. `menu` is a variable inside the `site.js` module, so the Console can't see it. The café put a copy on `window` (`window.cafeMenu = menu;`) on purpose so you could.

## Tier 3: Competent

### Q11. `is not a function`: NodeList has no `map` (`bugs/q11.js`)

**The error**

```
Uncaught TypeError: items.map is not a function
    at q11.js:5
```

**Answer**

```js
const items = document.querySelectorAll('#menu .menu-item');
const output = document.querySelector('#q11-output');

const names = Array.from(items).map((item) => item.dataset.name);
output.textContent = names.join(', ');
```

`[...items].map(...)` works too.

**Step by step**
1. "`items.map` is not a function" means: you wrote `items.map(...)`, so JavaScript looked up `map` on `items`, got `undefined`, and you can't call `undefined`.
2. What is `items`? In the Console, type `document.querySelectorAll('#menu .menu-item')`. It prints `NodeList(6) [li.menu-item, ...]`. A **NodeList**, not an Array.
3. Expand it and open `[[Prototype]]`: you'll see `forEach`, `entries`, `item`, `keys`... but no `map`, `filter` or `reduce`.
4. `Array.from(items)` makes a real array from the NodeList, and arrays have `map`.

**Why it works:** `querySelectorAll` gives back a NodeList: it looks like an array and has `forEach` and `length`, but not the other array methods.

**Common mistake:** "fixing" it by changing `.map` to `.forEach`. `forEach` always returns `undefined`, so `names.join` then fails with `Cannot read properties of undefined (reading 'join')`.

### Q12. Strings that look like numbers (`bugs/q12.js`)

**Answer**
- a) The third pause is for Muffin; at that moment `total` is `'02.251.95'` (a string; the Scope pane shows it in quotes).
- b) `typeof item.dataset.price` → `"string"`.
- c) Fixed:

```js
let total = 0;

items.forEach((item) => {
  total = total + Number(item.dataset.price);
});

output.textContent = `Whole menu costs $${total.toFixed(2)}`;
```

**Step by step**
1. Sources panel → in the file tree on the left, open `127.0.0.1:5500 → bugs → q12.js`. (Or press **Ctrl+P** / **Cmd+P** and type `q12`.)
2. Click the line number **9**. A blue marker appears: a breakpoint. Reload.
3. The page freezes and line 9 is highlighted. That line has **not run yet**. Look at **Scope → Module** (or **Local**/**Closure**): `total: 0`, and `item` is the Coffee `<li>`.
4. Press **Resume** (F8) twice. On the third pause, `total` is `'02.251.95'`. The quotes are the clue: it's text.
5. In **Watch**, click **+** and type `typeof item.dataset.price`. It says `"string"`. Every `data-*` value is a string, even `data-price="2.25"`.
6. `0 + '2.25'` is `'02.25'`: when one side of `+` is a string, `+` **joins** instead of adding. Use `Number(...)` to convert.
7. Remove the breakpoint (click the marker again), save the fix, and check: **$17.20**. `toFixed(2)` keeps two decimals and avoids a tiny rounding artefact.

**Why it works:** a breakpoint lets you look at every variable at one exact moment. Without it you'd only see the final wrong answer.

**Common mistake:** using `parseInt` here. `parseInt('2.25')` is `2`: it throws away the cents. Use `Number()` (or `parseFloat()`).

### Q13. Network: a successful request

**Answer**
- a) **200** (OK).
- b) `application/json` (Live Server adds `; charset=UTF-8`).
- c) **3** specials; the first is **Pumpkin Spice Latte**, price `4.75`.
- d) `site.js:37` (the `fetch('data/specials.json')` line).

**Step by step**
1. Open Network **before** you reload, because DevTools only records while it's open. Reload. One row per file: `index.html`, `styles.css`, `site.js`, every `qNN.js`, `main.js`, and two JSON files.
2. Click the **Fetch/XHR** filter button to show only data requests. You'll see `specials.json` (200) and `hours.json` (404, red: that's Q24).
3. Click `specials.json`. **Headers** shows the Request URL, the method (`GET`), the status code `200 OK`, and the response headers (look for `Content-Type`).
4. **Preview** shows the JSON as an expandable tree; **Response** shows the raw text.
5. The **Initiator** column (in the list) says which line of code started the request. Click it to jump there.

**Why it works:** the Network panel is the browser's record of every conversation with the server. When you use `fetch` next week, this is the first place to look: did the request go out, to the right URL, and what came back?

**Common mistake:** opening Network after the page has loaded and seeing an empty list. Reload with it open.

### Q14. Application: `localStorage`

**Answer**
- a) The key is `cafe-visits`; the value is however many times you've loaded the page (each reload adds 1).
- b) The header says **Visit #100**. The code reads the saved value (`'99'`), adds 1 and saves it again.

**Step by step**
1. Application panel → **Storage → Local Storage** → click `http://127.0.0.1:5500`. A table of keys and values appears.
2. Double-click the value next to `cafe-visits`, type `99`, press Enter.
3. Reload. `site.js` runs `Number(localStorage.getItem('cafe-visits') ?? 0) + 1` → `Number('99') + 1` → `100`, saves `100`, and shows `Visit #100`.

**Why it works:** `localStorage` is a small key/value store, kept per website (per *origin*: protocol + host + port), that survives reloads and restarts. The Application panel lets you read, edit and delete it by hand, which is perfect for testing "what if the saved data is weird?"

**Common mistake:** forgetting that `localStorage` only stores **strings**. That's why the code needs `Number(...)`. (Q23 and the bug-hunt demo are both about this.)

### Q15. `Unexpected token '}'` (`bugs/q15.js`)

**The error**

```
Uncaught SyntaxError: Unexpected token '}'  (q15.js:13)
```

**Answer**

```js
function greet(hour) {
  if (hour < 12) {
    return 'Good morning!';
  } else if (hour < 18) {
    return 'Good afternoon!';
  } else {
    return 'Good evening!';
  }
}

output.textContent = greet(new Date().getHours());
```

**Step by step**
1. A **SyntaxError** is different from the others: the browser couldn't even *read* the file, so **none** of it ran. That's why line 2 never set anything.
2. "Unexpected token `'}'`" means "I found a `}` where none was allowed". Click `q15.js:13`.
3. Count braces from the top: `function greet(hour) {` opens 1. `if ... {` opens 2, `} else if ... {` closes and reopens, `} else {` likewise, line 11 `}` closes the if/else (back to 1). Line 12 `}` closes the **function** (back to 0). Line 13 `}` has nothing to close: unexpected.
4. Delete one closing brace (line 12 or 13). Then press **Shift+Alt+F** (Mac: **Shift+Option+F**) in VS Code to reformat: the indentation now lines up.

**Why it works:** the browser reads the file before running it. The line it reports is where it gave up, which is often *after* the real mistake.

**Common mistake:** deleting braces at random until the error goes away. You'll end up closing the function in the wrong place and get `Illegal return statement` or a different error. Count, or let VS Code's bracket colours and the format command show you.

## Tier 4: Advanced

### Q16. Event Listeners pane

**Answer**
- a) `click`.
- b) `pickSurprise`, in `site.js`. The link in the pane points at the function (`site.js:26`); it was attached on line 31 with `surpriseButton.addEventListener('click', pickSurprise)`.
- c) It pauses on the first line inside `pickSurprise` (`site.js:27`). After stepping over line 28, the "Try the ...!" text appears.

**Step by step**
1. Inspect **Surprise me**. In the side pane (where Styles is), click the **Event Listeners** tab (you may need the **»** overflow arrow).
2. Expand `click` → `button#surprise-btn`. It shows `handler: ƒ pickSurprise()` and a link on the right. Click the link: Sources opens on the function.
3. Sources → right-hand side → **Event Listener Breakpoints** → expand **Mouse** → tick **click**.
4. Click Surprise me. The debugger pauses at the start of whatever listener handles the click: line 27, `const index = ...`.
5. **Step over** (F10) twice and watch the page: after line 28 runs, the text changes. Untick **click** when you're done, or every click will pause.

**Why it works:** on a big page you often don't know *which* code runs when you click something. The Event Listeners pane answers "what's attached to this element?"; Event Listener Breakpoints answer "pause in whatever code runs for this kind of event".

**Common mistake:** leaving the **Ancestors** option ticked and getting confused by listeners on `document` or `window` that a browser extension added. Untick **Ancestors** to see only the element's own listeners. Extensions' listeners show their own file names.

### Q17. Conditional breakpoint (`bugs/q17.js`)

**Answer**
- a) Condition: `Number.isNaN(quantity)` (or `isNaN(lineTotal)`). It pauses once, with `id = 137`. `quantities[136]` is `'l'`: a lowercase letter L, typed instead of the digit `1`.
- b) Change that `l` (third string, 37th character: `...218l531...`) to `1`. The box shows **$3489.00**.

**Step by step**
1. Open `q17.js` in Sources. Right-click the line number of `const lineTotal = price * quantity;` (line 18) → **Add conditional breakpoint...**
2. Type `Number.isNaN(quantity)` and press Enter. The marker turns orange.
3. Reload. The loop runs 136 times without stopping, then pauses. Scope shows `id: 137`, `quantity: NaN`, `price: 3`.
4. In the Console (while paused, it runs in the paused scope), type `quantities[id - 1]`. It prints `'l'`. `Number('l')` is `NaN`, and `NaN` spreads: any maths with `NaN` gives `NaN`, so the grand total is `NaN`.
5. Fix the character, remove the breakpoint, reload.

**Why it works:** a conditional breakpoint only pauses when its condition is true. It's how you find the one bad item in a loop of hundreds without clicking Resume 136 times.

**Common mistake:** writing `quantity === NaN` as the condition. It's **never** true: `NaN` is not equal to anything, not even itself. Use `Number.isNaN(...)`.

*(Also good: a **logpoint**. Right-click → **Add logpoint...** → `id, quantity`. It logs every loop without pausing, like a `console.log` you didn't have to type into your file.)*

### Q18. Step into, Scope and Call Stack (`bugs/q18.js`)

**Answer**
- a) `percent: 15`.
- b) Top to bottom: `applyDiscount` → `checkout` → `(anonymous)` (the click listener). Each has a file and line number.
- c) Fixed:

```js
function applyDiscount(price, percent) {
  return price - price * (percent / 100);
}
```

**Step by step**
1. Add `debugger;` as the first line inside `checkout`. Save. With DevTools **open**, click Check out. The code pauses on `debugger;`.
2. **Step over** (F10) once, to the `applyDiscount(...)` line. Then **Step into** (F11): you're now inside `applyDiscount`.
3. Scope → Local: `price: 20`, `percent: 15`. So the line works out `20 - 20 * 15` = `20 - 300` = `-280`. Then `addTax(-280)` = `-294`.
4. The Call Stack pane lists who called whom, newest at the top. Click `checkout` in it and Sources jumps to the line in `checkout` that is waiting for `applyDiscount` to return. Click back on `applyDiscount`.
5. **Step out** (Shift+F11) finishes `applyDiscount` and returns to `checkout`; hover over `discounted` to see `-280`.
6. Fix: `percent` is a whole-number percentage, so divide by 100. Remove `debugger;`. Result: `20 - 3 = 17`, `17 × 1.05 = 17.85`.

**Why it works:** **Step over** runs a whole line, including any functions it calls. **Step into** goes inside the function on that line. **Step out** runs to the end of the current function. Together with Scope you can watch a calculation one piece at a time.

**Common mistake:** clicking Check out with DevTools **closed**. `debugger;` only pauses when DevTools is open. And remember to delete it before you hand in work.

### Q19. Invisible but present: Computed styles

**Answer**
- a) Yes. Hovering the `<p id="promo">` line highlights a box below the menu: it takes up space, you just can't see it.
- b) `opacity: 0`.
- c) The rule `.card .promo { opacity: 0; }` in `styles.css` at line 64 (under "Seasonal styles").
- d) In the Styles pane, untick `opacity: 0` (or change it to `1`): the message appears. In the file: delete the `.card .promo` rule (or set `opacity: 1`).

**Step by step**
1. In Elements, press **Ctrl+F** / **Cmd+F** and search for `promo`, or expand the Menu section. Hover over the `<p>`: a highlighted box appears on the page in an empty-looking gap.
2. Open the **Computed** tab (next to Styles). Tick **Show all** off so only properties that are set are listed. Look for anything that hides things: `display: none`, `visibility: hidden`, `opacity: 0`, a colour that matches the background, a size of 0, or a position off-screen. Here: `opacity: 0`.
3. Click the arrow next to `opacity` to see where it comes from: `.card .promo` → `styles.css:64`.
4. Back in Styles, untick it to test.

**Why it works:** "it's in the DOM but I can't see it" has a short list of causes, and the Computed tab shows the final value of every property, plus which rule won. That separates "the element isn't there" (a JavaScript or HTML problem) from "it's there but hidden" (a CSS problem).

**Common mistake:** only checking `display`. An element can be fully present, with `display: block`, and still invisible because of `opacity`, `visibility`, colour or size.

### Q20. `event.target` vs `event.currentTarget` (`bugs/q20.js`)

**Answer**
- a) It happens only when you click on the small **+** box (the `<span class="icon">`) inside a button. Clicking the button's text or edge works.
- b) When it goes wrong, `event.target` is the `<span class="icon">` (it has no `data-item`, so `dataset.item` is `undefined`), while `event.currentTarget` is the `<button>`.
- c) Fixed:

```js
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const itemName = event.currentTarget.dataset.item;
    const line = document.createElement('li');
    line.textContent = `Added: ${itemName}`;
    cart.append(line);
  });
});
```

(`button.dataset.item` works too, because `button` is the loop variable.)

**Step by step**
1. Reproduce: click the word "Coffee" on the first button (works), then click the **+** (adds `undefined`). Now you know *when*.
2. Breakpoint on line 8. Click the **+**. Hover over `event` or type `event.target` in the Console: `span.icon`. Type `event.currentTarget`: `button.add-btn`.
3. `event.target` is the element you actually clicked, the innermost one. `event.currentTarget` is the element whose listener is running: the button.
4. The `data-item` attribute is on the button, so read it from `currentTarget`.

**Why it works:** clicks start at the innermost element and **bubble** up through its parents. The button's listener runs for clicks on anything inside it, and `target` tells you where the click started.

**Common mistake:** "fixing" it with CSS `pointer-events: none` on the span. It works, but it hides the real misunderstanding, and the same bug will come back the next time the button has an icon in it.

## Tier 5: Applied

### Q21. No error, nothing happens (`bugs/q21.js`)

**Answer**

```js
tipButton.addEventListener('click', () => {
  tipOutput.textContent = 'Thanks for the tip!';
});
```

**Step by step** (one good path)
1. No error, so the Console can't help directly. First question: **is my code running at all?** Inspect the button → **Event Listeners**. You'll find a listener under **`Click`** (capital C), not under `click`.
2. Or add `console.log('tip clicked')` inside the listener: it never logs. So the listener never runs, even though the button clearly gets clicked.
3. Event names are **case-sensitive** and all lower-case: `click`, `input`, `submit`, `keydown`. `'Click'` is a made-up event that never happens. `addEventListener` happily accepts any name, so there's no error.

**Why it works:** "no error and nothing happens" usually means the code you're looking at never runs. Prove whether it runs (log or breakpoint) before you study what it does.

**Common mistake:** rewriting the code inside the listener. It was never the problem: it just never got called.

### Q22. The update goes somewhere else (`bugs/q22.js`)

**Answer**

```js
const countSpan = document.querySelector('#q22 .count');
```

**Step by step** (one good path)
1. Is the code running? Put a breakpoint inside the listener (line 9) and click: it pauses, so yes. Hover over `countSpan` (or type it in the Console while paused). DevTools shows the element, and hovering it highlights... nothing visible on the page.
2. Right-click `countSpan` in the Scope pane → **Reveal in Elements panel**. It's the `<span class="count">` inside `<p class="staff-only">` in the **header**, which is hidden (`display: none`).
3. Another way: open Elements, expand the header, and click +1 coffee. DevTools **flashes** (purple highlight) any node that JavaScript changes. The flashing one is in the header, not in Q22.
4. `document.querySelector('.count')` returns the **first** `.count` in the whole page, and the hidden staff counter comes first. Scope the selector to the Q22 section: `'#q22 .count'`.

**Why it works:** the code was right; it was just updating the wrong element. When "nothing changes", check *which* element your variable really holds.

**Common mistake:** testing `document.querySelector('.count')` in the Console, seeing `<span class="count">0</span>`, and assuming it's the right one. Hover it or reveal it in Elements to see *where* it is.

### Q23. Works until you reload (`bugs/q23.js`)

**What you see.** First load: Add a coffee works (`Cart: Coffee`). Reload: an error appears **on load**, and clicking Add gives another:

```
Uncaught TypeError: cart.join is not a function      (q23.js:9, on load)
Uncaught TypeError: cart.push is not a function      (q23.js:13, on click)
```

**Answer**

```js
const saved = localStorage.getItem('q23-cart');
const cart = saved ? JSON.parse(saved) : [];
```

**Step by step** (one good path)
1. Reproduce exactly: add, reload, add. Note it only fails **after a reload**. That points at something saved between page loads: `localStorage`.
2. Application → Local Storage: `q23-cart` holds `["Coffee"]`. That's fine: it's the correct JSON text.
3. Breakpoint on line 6 (or log `typeof cart` after it). After a reload, `localStorage.getItem('q23-cart')` returns the **string** `'["Coffee"]'`, which is truthy, so `cart` becomes that string. Strings have `length`, but no `join` or `push`.
4. Saving used `JSON.stringify` (correct). Loading must use `JSON.parse` to turn the text back into an array.
5. To re-test from scratch: Application → select the `q23-cart` row → **Delete** (or click Empty the cart). Then add, reload, add, reload: `Cart: Coffee, Coffee` survives.

**Why it works:** `localStorage` only stores text. `JSON.stringify` on the way in, `JSON.parse` on the way out, always as a pair.

**Common mistake:** writing `JSON.parse(localStorage.getItem('q23-cart')) || []`. It works (because `JSON.parse(null)` is `null`), but if the saved value is ever bad text, it throws. Being explicit with `saved ? ... : []` is easier to read and to debug.

### Q24. Network: a 404 (`site.js`)

**Answer**

```js
const response = await fetch('data/opening-hours.json');
```

**Step by step** (one good path)
1. The Console has a yellow warning: `Could not load the opening hours: HTTP 404`. There may also be a red `GET http://127.0.0.1:5500/data/hours.json 404 (Not Found)` line.
2. Network panel → reload → **Fetch/XHR** filter. `hours.json` is red with status **404**. Click it: **Headers → Request URL** is `.../data/hours.json`.
3. 404 means "the server has nothing at that address". So check the address. In VS Code, the `data/` folder contains `specials.json` and `opening-hours.json`. There is no `hours.json`.
4. Click the Initiator link: `site.js:51`, the `fetch('data/hours.json')` line. Fix the path. Reload: status **200** and `7:30 a.m. to 6:00 p.m.`

**Why it works:** the Network panel shows exactly what the browser requested. Compare that URL, character for character, with what's really on the server.

**Common mistake:** assuming a 404 means the server is broken. A 404 is the server working correctly: it's telling you the address is wrong. A **500** is the server breaking. You'll see both next week.

### Q25. The full method and a bug report (`bugs/q25.js`)

**What you see**

```
Uncaught TypeError: total.toFixed is not a function
    at HTMLButtonElement.<anonymous> (q25.js:14)
```

**Answer**

```js
button.addEventListener('click', () => {
  const bill = Number(billInput.value);
  const tipPercent = Number(tipSelect.value);
  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;
  output.textContent = `Tip: $${tip.toFixed(2)} · Total: $${total.toFixed(2)}`;
});
```

**a) The seven steps (example)**

```js
// 1 Reproduce: bill 40, tip 15%, click Calculate. Expected "Tip: $6.00 · Total: $46.00". Nothing changes.
// 2 Read: "Uncaught TypeError: total.toFixed is not a function" - total isn't a number.
// 3 Locate: q25.js:14, the output line. total comes from line 13: bill + tip.
// 4 Guess: bill is a string (input .value), so bill + tip joins text: "40" + 6 = "406".
// 5 Test: breakpoint on line 13. Scope: bill "40" (quotes), tip 6. Step over: total "406".
// 6 Fix: Number(billInput.value) (and Number(tipSelect.value) to be safe).
// 7 Re-test: 40 / 15% -> Tip $6.00 · Total $46.00. Also 25.50 / 20% -> Tip $5.10 · Total $30.60.
```

**b)** No. Line 14 is where the program **noticed** the problem: you can't call `.toFixed` on a string. The mistake is on line 10 (`billInput.value` is a string), which made line 13 join text instead of adding. `tip` was fine only by luck: `*` and `/` always convert strings to numbers, but `+` doesn't.

**c) Bug report (example)**

```js
// Browser: Edge 1xx on Windows 11, served with Live Server.
// Steps: 1) Open index.html. 2) Leave Bill = 40, Tip = 15%. 3) Click Calculate.
// Expected: "Tip: $6.00 · Total: $46.00".
// Actual: the text doesn't change; Console shows "TypeError: total.toFixed is not a function" at q25.js:14.
// Evidence: paused at line 13, bill = "40" (string), tip = 6; total became "406".
```

**Why it works:** the seven steps stop you guessing. Each step produces evidence, and the bug report passes that evidence on so someone else (or you, tomorrow) can reproduce it in 30 seconds.

**Common mistake:** wrapping line 14 in `Number(total).toFixed(2)`. That shows `Total: $406.00` with no error: you've turned a loud bug into a quiet wrong answer, which is worse.

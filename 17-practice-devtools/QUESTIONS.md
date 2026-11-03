# Day 19 practice: browser DevTools (25 questions)

**How to work.** Open `index.html` with **Live Server** (right-click → *Open with Live Server*). It must be served: the page uses ES modules and loads JSON files, and neither works from a `file://` address. Use **Chrome or Edge**, and open DevTools with **F12** (Mac: **Cmd+Option+I**).

There are two kinds of question:

- **Find it** questions: use DevTools to find a fact about the page. Write your answer down (a comment in `main.js` is fine, e.g. `// Q2: ...`).
- **Fix it** questions: a small file in `bugs/` is broken. Use DevTools to find out why, then fix **that file**. Each fix-it question has its own box on the page that tells you when it works.

**Rules.**
- For fix-it questions, change only the file the question names. Don't change `index.html` or `styles.css` (Q19 asks what you *would* change, and you can test it in DevTools).
- Find the bug **with DevTools first**, then fix it. Reading the file top to bottom and guessing is not the skill we're practising.
- Every fix should be small: usually one line, sometimes one word.
- Fix one thing, save, and the page reloads. Check the Console again after every fix.

The questions start simple and get harder. Answers and full walkthroughs are in `WALKTHROUGH.md`. Try first, then check.

> **Tip:** When the page first loads, the Console will be full of red. That's on purpose: most of those errors belong to the fix-it questions. The file name on the right of each message (like `q04.js:5`) tells you which question it belongs to.

---

## Tier 1: Simple (one idea)

**Q1.** Open DevTools three different ways: with the keyboard shortcut, with the browser menu, and by right-clicking the **Menu** heading and choosing **Inspect**. Which panel opens when you use **Inspect**, and what is already selected in it?

**Q2.** *(Find it, Elements)* What is the `id` of the **Today's specials** heading?

**Q3.** *(Find it, Console)* In the Console, type `document.title` and press Enter. What is the page's title? Then type `document.querySelectorAll('.menu-item').length`. How many menu items are there?

**Q4.** *(Fix it: `bugs/q04.js`)* The Q4 box says "Q4 is broken." Read the red error for `q04.js` in the Console and fix it. Done when the box says **Q4 is working!** and the Console shows `Q4 loaded`.

**Q5.** *(Find it, Console + Elements)* In the Elements panel, click the **$3.25** price next to Muffin so it's selected. Switch to the Console and type `$0.textContent`. What does it print? Then type `$('.badge--sale').textContent`. What does that print, and what is `$()` a shortcut for?

## Tier 2: Easy

**Q6.** *(Elements, live edit)* In the Elements panel, double-click the text **Campus Café** in the `<h1>` and change it to your own café name. Press Enter. Then reload the page. What happens, and why?

**Q7.** *(Find it, Styles pane)* Inspect the red **On sale** badge next to Muffin.
- a) What background colour does the Styles pane say it has, and which rule sets it?
- b) Which background rule is crossed out, and why?
- c) Use the **`.cls`** button to switch the `badge--sale` class **off**. What does the badge look like now?

**Q8.** *(Fix it: `bugs/q08.js`)* Click **Click me** in the Q8 box. The count doesn't change and the Console shows an error. Fix it. Done when it counts up: `Clicked 1 times`, `Clicked 2 times`, ...

**Q9.** *(Fix it: `bugs/q09.js`)* The Q9 file crashes as soon as the page loads, so **Place order** does nothing. Fix it. Done when clicking it shows **Order placed!**

**Q10.** *(Find it, Console)* The café exposes its menu as a global variable called `cafeMenu`. In the Console, run `console.table(cafeMenu)`.
- a) Which item is the cheapest?
- b) How many items are drinks?
- c) Click a column heading in the table. What happens?

## Tier 3: Competent (everyone must be able to do these)

**Q11.** *(Fix it: `bugs/q11.js`)* The Q11 box should list every menu item: `Coffee, Tea, Muffin, Bagel, Smoothie, Cookie`. Read the error and fix it. (Hint: what kind of thing does `querySelectorAll` give back? Type `document.querySelectorAll('.menu-item')` in the Console and look.)

**Q12.** *(Fix it with a breakpoint: `bugs/q12.js`)* The Q12 box says the whole menu costs `$02.251.953.252.755.501.50`. There's no error.
- a) In Sources, open `bugs/q12.js` and set a breakpoint on line 9. Reload. When the code pauses the **third** time, what is the value of `total` in the Scope pane?
- b) Add a Watch expression `typeof item.dataset.price`. What does it show?
- c) Fix the file. Done when it says **Whole menu costs $17.20**.

**Q13.** *(Find it, Network)* Open the Network panel and reload the page.
- a) Find the request for `specials.json`. What is its **status code**?
- b) In its **Headers** tab, what is the `Content-Type` of the response?
- c) In its **Preview** or **Response** tab, how many specials are there, and what is the first one?
- d) In the **Initiator** column, which file and line asked for it?

**Q14.** *(Find it, Application)* Open **Application → Local Storage → `http://127.0.0.1:5500`**.
- a) What is the key the café uses to count your visits, and what is its value right now?
- b) Double-click the value, change it to `99`, press Enter and reload the page. What does the header say now, and why that number?

**Q15.** *(Fix it: `bugs/q15.js`)* Nothing in this file runs. The Console shows a `SyntaxError` with the words `Unexpected token`. Fix it. Done when the Q15 box shows a greeting (Good morning/afternoon/evening).

## Tier 4: Advanced

**Q16.** *(Find it, Event Listeners pane)* Inspect the **Surprise me** button. In the Elements panel's side pane, open **Event Listeners**.
- a) What type of event is listened for?
- b) What is the name of the function that runs, and which file and line is it in?
- c) Use **Sources → Event Listener Breakpoints → Mouse → click**, then click **Surprise me**. Where does the code pause? Step over until `surpriseOutput.textContent` changes. (Remember to untick the breakpoint afterwards.)

**Q17.** *(Conditional breakpoint: `bugs/q17.js`)* The Q17 box says `Grand total for 200 orders: $NaN`. One order out of 200 is to blame. Clicking through 200 loops is not an option.
- a) Right-click the line number of `const lineTotal = price * quantity;` and choose **Add conditional breakpoint**. Type a condition that is only true for the bad order. Reload. Which order `id` is it, and what was the bad character?
- b) Fix the data. Done when the box shows **$3489.00**.

**Q18.** *(Step into, call stack: `bugs/q18.js`)* $20.00 with 15% off, then 5% tax, should be **$17.85**. Clicking **Check out** shows `$-294.00`.
- a) Add the line `debugger;` as the first line inside `checkout`. Save, open DevTools, click **Check out**. Use **Step into** to go inside `applyDiscount`. What is the value of `percent` in the Scope pane?
- b) While you're inside `applyDiscount`, what does the **Call Stack** pane list, from top to bottom?
- c) Fix the bug (and remove `debugger;`). Done when the box shows **$17.85**.

**Q19.** *(Find it, Computed styles)* There's a promo message in the HTML (`#promo`) inside the Menu card, but you can't see it on the page.
- a) Find it in the Elements panel. Hover over it: is it taking up space on the page?
- b) In the **Computed** tab, which property makes it invisible, with what value?
- c) Which rule, in which file and on which line, sets that value?
- d) Test a fix in DevTools (without editing any file). What would you change in `styles.css`?

**Q20.** *(Fix it: `bugs/q20.js`)* The quick-add buttons add items to the list below them. Sometimes the list says `Added: undefined`.
- a) Work out *exactly when* it happens. (Try clicking different parts of a button.)
- b) Set a breakpoint inside the listener and look at `event.target` and `event.currentTarget` in the Scope pane (or Console) when it goes wrong. What's the difference?
- c) Fix it so every click on a button adds the right item, wherever you click on the button.

## Tier 5: Applied (real problems: you choose the tools)

**Q21.** *(`bugs/q21.js`)* "The **Leave a tip** button does nothing. There's no error." Find out why and fix it. Done when clicking it shows **Thanks for the tip!**

**Q22.** *(`bugs/q22.js`)* "When I click **+1 coffee**, the number in the Q22 box stays at 0. There's no error in the Console." Find out where the number is actually going, and fix it.

**Q23.** *(`bugs/q23.js`)* "The saved cart works the first time. Then I reload the page and it breaks." Reproduce it (click **Add a coffee**, reload, click again), find the cause and fix it so the cart survives any number of reloads. (Before you test your fix, you may need to clean up what's already saved. Where?)

**Q24.** *(`site.js`)* The specials load, but **Hours:** always says `Hours unavailable.` The Console has a yellow warning. Use DevTools to find out exactly what the browser asked for and what it got back. Then fix it in `site.js`. Done when it says **7:30 a.m. to 6:00 p.m.** (Look in the `data/` folder in VS Code too.)

**Q25.** *(`bugs/q25.js`, full method + bug report)* The tip calculator should show `Tip: $6.00 · Total: $46.00` for a $40 bill with a 15% tip. Click **Calculate**.
- a) Debug it using all seven steps: **reproduce, read, locate, guess, test, fix, re-test**. Write one line for each step as a comment at the top of `q25.js`.
- b) The error message points at one line. Is that the line with the mistake? Explain.
- c) Write a 5-part bug report (as a comment): browser, steps to reproduce, expected, actual, evidence.

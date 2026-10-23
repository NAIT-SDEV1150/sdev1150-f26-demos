# Day 15 practice: the DOM and events (25 questions)

**How to work:** open `index.html` with Live Server. Write every answer in `main.js`, one under the other. Put a comment like `// Q1` above each answer. Save, then check the page (and the Console) after each one.

**Rules:** use `const` and `let`, arrow functions and template literals. Don't change `index.html` or `styles.css`. Don't use `innerHTML`.

**Classes you can use** (they are already in `styles.css`): `.hidden`, `.highlight`, `.boxed`, `.dark`, `.error`, `.ok`, `.warning`, `.liked`.

The questions start easy and get harder. Answers and walkthroughs are in `WALKTHROUGH.md`. Try first, then check.

---

## Tier 1: Easy (find one element, change it)

**Q1.** Select the heading with the id `page-title`. Change its text to `My Practice Page`.

**Q2.** Select the paragraph with the class `subtitle`. Change its text to `Learning the DOM one step at a time`.

**Q3.** Select the `footer` element by its tag name. Change its text to `Made by: ` followed by your name.

**Q4.** Make a `const` that holds a name. Use a template literal to change the text of `#greeting` to `Hello, <name>! Welcome to class.`

**Q5.** Change the background colour of the `#intro` section to `lightyellow` using `.style`.

## Tier 2: A little harder (many elements, classes, new elements)

**Q6.** Select **all** the elements with the class `item`. Show how many there are in `#item-count`, like this: `There are 5 items.`

**Q7.** Select all the `.note` paragraphs. Use `forEach` to make the text of every one `navy`.

**Q8.** Three small selector jobs:
- a) Use a **descendant** selector to find every `.sale` item inside `#products`. Make their text red.
- b) Use `:nth-child` to find the 3rd `li` in `#products`. Make it bold.
- c) Use an **attribute** selector to find the element with `data-role="tip"`. Change its text to `Tip: attribute selectors use square brackets.`

**Q9.** Use `classList` three ways:
- Add the class `highlight` to the `.important` paragraph.
- Remove the class `hidden` from `#banner`, so it shows up.
- Toggle the class `boxed` on `#products`.

**Q10.** Make a brand-new paragraph with the text `I was made by JavaScript!`. Put it inside the empty `#output` area.

## Tier 3: Simple events

**Q11.** When you click `#btn-hello`, change the text of `#hello-text` to `You clicked the button!`

**Q12.** When you click `#btn-theme`, turn dark mode on. Click it again to turn it off. (Toggle the class `dark` on the `body`.)

**Q13.** When the mouse moves onto any item in `#products`, add the class `highlight` to that item. When the mouse leaves, take the class off.

**Q14.** As you type in `#name-input`, show `Hi, <what you typed>!` in `#preview`. It should update on every key.

**Q15.** Two `change` events:
- a) When the `#agree` checkbox changes, show `Agreed` or `Not agreed` in `#agree-status`.
- b) When the `#size` dropdown changes, show `You picked <size>` in `#size-status`.

## Tier 4: More complex

**Q16.** Make the counter work. `+` adds 1 and `−` takes away 1. Show the number in `#count`. (It can go below zero.)

**Q17.** When you press **Enter** in `#new-item`, add what you typed as a new `li` in `#todo-list`.
- Trim the spaces off the ends.
- If the box is empty, add nothing.
- After adding, clear the box and put the cursor back in it.

**Q18.** Upgrade Q17. **Replace** your Q17 code, so you don't have two listeners. Now each new item also gets a `✕` button. Clicking the `✕` removes **that** item.

**Q19.** Clicking `#btn-panel` shows or hides `#panel` (toggle the class `hidden`). The button text should flip between `Show details` and `Hide details`.

**Q20.** When `#signup-form` is submitted:
- Stop the page from reloading.
- If `#email` has no `@`, show `Your email needs an @ sign.` and give it the class `error`.
- Otherwise show `Thanks for signing up!` and give it the class `ok`.
- Show the message in the element that comes **right after** the input. Don't use an id to find it.

## Tier 5: Applied (you pick the method)

**Q21.** **Like button.** Every click on `#btn-like` should add one like. The button shows the count, like `♥ Like (3)`. After the first click, it gets the class `liked`.

**Q22.** **Character counter.** As someone types in `#bio`, show how many characters they've used in `#char-count`, like `12 / 50`. When they go over 50, the counter gets the class `warning`. When they go back to 50 or fewer, it loses the class.

**Q23.** **Filter a list.** As you type in `#search`, only show the fruits in `#fruit-list` whose name contains what you typed. Upper or lower case shouldn't matter. An empty box shows all the fruits.

**Q24.** **Shopping list with a total.** When `#cart-form` is submitted, add the item and its price to `#cart`, like `Milk: $3.50`. Keep a running total in `#total`, like `Total: $5.75`. Skip the item if the name is empty or the price is empty or zero. Clear both boxes after adding.

**Q25.** **Colour picker.** When you pick a colour in `#color-picker`, the whole page background changes to that colour. `#color-value` shows the colour code, like `#ffcc00`.

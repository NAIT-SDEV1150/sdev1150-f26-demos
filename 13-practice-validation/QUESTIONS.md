# Day 19 practice: form validation (25 questions)

**How to work:** open `index.html` with Live Server. Write every answer in `main.js`, one under the other, with a comment like `// Q1` above each. Save, then check the page (and the Console) after each one.

**Rules:** use `const` and `let`, arrow functions and template literals. Don't change `index.html` or `styles.css`. Don't use `innerHTML`. Give every `const` a name you haven't used yet (all 25 answers share one file).

**Classes you can use** (already in `styles.css`): `.touched` (with `:invalid` it gives a red border, with `:valid` a green one), `.error-message`, `.ok`, `.bad`, `.hidden`.

**Tiers:** Simple (one idea, one or two lines) → Easy → Competent (what everyone must be able to do) → Advanced → Applied (realistic problems: you decide which technique to use).

Answers and step-by-step walkthroughs are in `WALKTHROUGH.md`. Try first, then check.

---

## Tier 1: Simple (Q1–Q5)

**Q1.** `#a-name` is required and empty. Show its `validity.valueMissing` flag in `#out-1`, like `valueMissing: true`.

**Q2.** `#a-age` has `min="13"` and the value `5`. Show its `validity.rangeUnderflow` flag in `#out-2`, like `rangeUnderflow: true`.

**Q3.** `#a-form` doesn't have `novalidate`. Turn it on **from JavaScript**, then show `noValidate: true` in `#out-3` by reading the form's `noValidate` property.

**Q4.** Mark `#a-code` as invalid with the custom message `That code has expired.` Then show the field's `validationMessage` in `#a-code-error`.

**Q5.** Ask the whole `#a-form` whether it is valid, **without** showing any browser bubbles. Show the answer in `#out-5`, like `Form valid: false`.

## Tier 2: Easy (Q6–Q10)

**Q6.** When the user leaves `#b-email` (the `blur` event), add the class `touched` to it. (Then try it: tab out of the empty field and watch the border.)

**Q7.** As the user types in `#b-postal`, show `Use a postal code like T2N 1N4.` in `#b-postal-error` when the value doesn't match the field's `pattern`. Clear the message when it does match. Use the `validity` object, not your own regular expression.

**Q8.** As the user types in `#b-phone`:
- set its `aria-invalid` attribute to `"true"` when the field is invalid and `"false"` when it is valid;
- show `Use the format 403-555-0199.` in `#b-phone-error` when it is invalid, and nothing when it is valid.

**Q9.** `#b-nick` is `required`, but its value is three spaces, and the browser thinks that's fine. Use `setCustomValidity` so that an empty or spaces-only nickname shows `Nickname can't be empty or just spaces.` in `#b-nick-error`. Run the check once when the page loads **and** every time the user types.

**Q10.** When `#b-form` is submitted, stop the page reload, read **all** its fields with `FormData` and `Object.fromEntries`, and show the result in `#b-out` with `JSON.stringify(data, null, 2)`.

## Tier 3: Competent (Q11–Q15): the workshop booking form

All five questions use `#c-form`. Each input has a `data-label` and an `aria-describedby` that points at its error div.

**Q11.** Write a function `messageFor(input)` that returns a friendly message based on `input.validity`. Check the flags in this order and return:

| Flag | Message |
|---|---|
| `valid` | `''` |
| `customError` | the input's `validationMessage` |
| `valueMissing` | `Please enter your <data-label>.` |
| `typeMismatch` | `Please enter a valid <data-label>.` |
| `tooShort` | `Use at least <minlength> characters.` |
| `rangeUnderflow` | `Choose at least <min>.` |
| `rangeOverflow` | `Choose <max> or fewer.` |
| `stepMismatch` | `Use a whole number.` |
| anything else | the input's `validationMessage` |

Test it in the Console: `messageFor(document.querySelector('#c-name'))` should give `Please enter your name.`

**Q12.** Write `validate(input)` that:
1. clears any old custom error;
2. sets the custom error `Please enter your <data-label>.` if the value is only spaces, or `Use at least <minlength> characters.` if the **trimmed** value is shorter than the input's `minLength`;
3. gets the message from `messageFor`;
4. puts it in the element whose id is in the input's `aria-describedby`;
5. sets `aria-invalid` to `"true"` or `"false"`;
6. returns `true` when the field is valid.

**Q13.** Wire up every input in `#c-form` (get them from `form.elements`):
- on `blur`: add `touched`, then validate;
- on `input`: validate **only if** the field already has `touched`.

**Q14.** When `#c-form` is submitted:
- stop the reload;
- add `touched` to every field and validate **every** field (all messages must show, not just the first);
- if any are invalid, show `Please fix 3 fields.` (with the real number, and `field` for just one) in `#c-status`, give it the class `bad`, and put the cursor in the **first** invalid field.

**Q15.** Finish the submit handler. When everything is valid:
- read the values with `FormData`;
- reset the form;
- show `Booked 2 seats for Sam.` (real seats and trimmed name; `seat` for 1) in `#c-status` with the class `ok`.

Add a `reset` listener on `#c-form` that, for every field, clears the custom error, the `touched` class, `aria-invalid` and the error text, and moves the cursor to `#c-name`. It should also clear `#c-status`. Check that the **Clear** button and a successful booking both leave the form clean.

## Tier 4: Advanced (Q16–Q20)

**Q16.** Write `checkConfirm()`: when `#d-confirm` is not empty and doesn't match `#d-pass`, set its custom error to `Passwords do not match.`; otherwise clear it. Show the message in `#d-confirm-error` (nothing while the confirm box is empty). Run it when **either** password field changes.

**Q17.** Write `checkDates()` for the trip dates:
- the return date picker should not allow days before the departure date (set `#d-to`'s `min`);
- if both dates are filled and the return date is the **same day or earlier**, set a custom error `Return date must be after the departure date.` on `#d-to` and show it in `#d-to-error`.

Run it when either date changes.

**Q18.** **Error summary.** When `#d-form` is submitted:
- stop the reload and run `checkConfirm()` and `checkDates()` so custom errors are up to date;
- list every invalid input in `#d-summary-list`: one `li` per field containing a `button` whose text is `<label text>: <validationMessage>`, e.g. `Confirm password: Passwords do not match.` Clicking the button puts the cursor in that field;
- replace the old list each time (don't pile up duplicates) and focus the first invalid field;
- if nothing is invalid, the list is empty and `#d-done` says `Trip saved.`

Hint: every input has a `labels` list.

**Q19.** **Validity inspector.** In `#d-flags`, list (one `li` each) the name of every `ValidityState` flag that is currently `true` for `#d-probe`. Update it when the page loads and on every keystroke. Don't type out the flag names: loop over `input.validity` with `for...in`.

**Q20.** Keep `#d2-submit` **disabled** until the whole `#d2-form` is valid (email filled in and the box ticked). Use **one** listener on the form, not one per field. On submit: stop the reload, show `Subscribed!` in `#d2-out`, reset the form and disable the button again. (In the walkthrough: why some designers avoid disabled buttons.)

## Tier 5: Applied (Q21–Q25)

**Q21.** **Pizza toppings.** The customer must pick **1 to 3** toppings. HTML has no "at least one checkbox in this group" rule. Show `Choose at least one topping.` or `Choose up to 3 toppings (you have 4).` in `#e-toppings-error` whenever a box changes, and make the form count as invalid while it's wrong. On a valid submit, show `Ordered: Mushroom, Olive` (the ticked toppings, in order) in `#e-pizza-out`.

**Q22.** **Promo code.** `#e-promo` is optional. Valid codes are `SAVE10` (10% off) and `STUDENT` (15% off), and customers type them in any case with stray spaces. As they type, show `15% off applied.` (class `ok`) for a good code, `Unknown promo code.` for anything else (and make the field invalid), and nothing when the box is empty.

**Q23.** **Fix the bugs.** A teammate wrote this for `#e-rsvp-form`. Paste it into `main.js`, try it, then fix it.

```js
const rsvpForm = document.querySelector('#e-rsvp-form');
const guest = document.querySelector('#e-guest');
const guestCount = document.querySelector('#e-count');
const rsvpOut = document.querySelector('#e-rsvp-out');

function check(input) {
  input.nextElementSibling.textContent = input.validationMessage;
  if (input === guest && input.value.trim().length < 2) {
    input.setCustomValidity('Please enter a name (2+ letters).');
  }
  return input.validity.valid;
}

rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!rsvpForm.reportValidity()) return;
  if (!check(guest) || !check(guestCount)) return;
  rsvpOut.textContent = `RSVP saved: ${guest.value.trim()}, ${guestCount.value} people.`;
  rsvpForm.reset();
});
```

Users report:
- a grey browser bubble appears, even though the form has `novalidate`, and the red messages under the fields never show for empty fields;
- type `S` as the name: the message under it appears one submit **late**;
- after fixing the name to `Sam`, the form **still** won't submit;
- once those are fixed: with both fields wrong, only the name's message shows.

Find all four causes and fix them.

**Q24.** **Phone numbers people actually type.** Users type `(403) 555 0199`, `403.555.0199` or `1 403 555 0199`. A `pattern` would reject all of those. When the user leaves `#e-phone`:
- keep only the digits; if there are 11 and the first is `1`, drop the `1`;
- if 10 digits remain, rewrite the field as `403-555-0199`;
- otherwise set the custom error `Enter a 10-digit phone number.`;
- an empty field is fine (it's optional).

Show the field's `validationMessage` in `#e-phone-error`.

**Q25.** **Only save real changes.** `#e-profile-form` is pre-filled. The **Save changes** button (`#e-save`) should be enabled only when the form is **valid** and **different from what was last saved**. If the user changes the city and then changes it back, the button disables again. On submit: stop the reload, treat the current values as the new "saved" values, show `Saved.` in `#e-profile-out`, and update the button. Hint: compare `JSON.stringify` of the `FormData` object.

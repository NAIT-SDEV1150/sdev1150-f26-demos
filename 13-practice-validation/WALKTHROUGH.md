# Day 19 practice: walkthrough and answers

Try each question on your own first. Then come here to check.

Every answer below was tested in a real browser (Microsoft Edge) against `index.html`. You can paste all 25 into one `main.js`, one after the other: they use different variable names on purpose. Q14 and Q15 share one submit handler (Q15 finishes it), and Q23's answer **replaces** the buggy code from the question.

Each question has:
- **Look at the HTML:** what in `index.html` the question depends on
- **Answer:** the code
- **Step by step:** what each line does, and why this method
- **What you'll see**
- **Common mistake**

One idea runs through the whole set: **the HTML holds the rules, the browser checks them, and JavaScript reads the result** from `input.validity`, turns it into friendly words, and decides when to show them.

---

## Tier 1: Simple

### Q1. Read one flag: `valueMissing`

**Look at the HTML:** `<input id="a-name" ... required>` with no `value`. `required` is the rule; the field is empty, so the rule is broken.

```js
const aName = document.querySelector('#a-name');
document.querySelector('#out-1').textContent = `valueMissing: ${aName.validity.valueMissing}`;
```

**Step by step**
1. Find the input.
2. `aName.validity` is the field's **ValidityState** object: a set of true/false flags the browser keeps up to date.
3. `valueMissing` is the flag for "required, but empty". Drop it into a template literal and show it.

**Why this method:** you don't need to check `value === ''` yourself. The browser already worked it out from the `required` attribute.

**What you'll see:** `valueMissing: true`.

**Common mistake:** writing `aName.valueMissing`. The flags live on `.validity`, not on the input itself, so you'd see `valueMissing: undefined`.

### Q2. Read `rangeUnderflow`

**Look at the HTML:** `<input id="a-age" type="number" min="13" value="5">`. `min="13"` is the rule; `5` is below it.

```js
const aAge = document.querySelector('#a-age');
document.querySelector('#out-2').textContent = `rangeUnderflow: ${aAge.validity.rangeUnderflow}`;
```

**Step by step**
1. Find the input.
2. `rangeUnderflow` means "below `min`". (`rangeOverflow` is "above `max`".)
3. Show it.

**What you'll see:** `rangeUnderflow: true`. Change the value in the box to `20` and reload: still `true`, because this code runs **once**, when the page loads. To keep it live, you'd put it in an `input` listener.

**Common mistake:** comparing `aAge.value < 13` yourself. It works here, but `aAge.value` is the **string** `"5"`, and the browser's flag also handles `max`, `step` and dates for free.

### Q3. Turn on `novalidate` from JavaScript

**Look at the HTML:** `<form id="a-form">` has no `novalidate` attribute.

```js
const aForm = document.querySelector('#a-form');
aForm.noValidate = true;
document.querySelector('#out-3').textContent = `noValidate: ${aForm.noValidate}`;
```

**Step by step**
1. The `novalidate` **attribute** has a matching **property**, `noValidate` (capital V, like most two-word properties).
2. Setting it to `true` adds the attribute. Check the Elements panel: `<form id="a-form" novalidate="">`.
3. Read it back and show it.

**Why it matters:** `novalidate` stops the browser blocking the submit and showing its grey bubble. It does **not** switch the rules off: `validity` keeps working.

**What you'll see:** `noValidate: true`.

**Common mistake:** `aForm.novalidate = true` (lower-case v). That just creates a new, useless JavaScript property. Nothing happens to the form.

### Q4. A custom error

**Look at the HTML:** `#a-code` has no rules at all, and `#a-code-error` is an empty span after it.

```js
const aCode = document.querySelector('#a-code');
aCode.setCustomValidity('That code has expired.');
document.querySelector('#a-code-error').textContent = aCode.validationMessage;
```

**Step by step**
1. `setCustomValidity('...')` marks the field **invalid** with your message. It sets the `customError` flag.
2. `validationMessage` gives the message back. With a custom error, it's **your** text.
3. Show it in the span.

**What you'll see:** `That code has expired.` next to the box.

**Common mistake:** expecting the error to go away when the user types. It won't. A custom error stays until you call `setCustomValidity('')`.

### Q5. Is the whole form valid?

```js
document.querySelector('#out-5').textContent = `Form valid: ${aForm.checkValidity()}`;
```

**Step by step**
1. `checkValidity()` works on a single field **or** a whole form. On a form, it's `true` only if every field is valid.
2. It returns `true`/`false` **quietly**: no bubbles.

**What you'll see:** `Form valid: false` (the name is empty, the age is too low and the code has your custom error).

**Common mistake:** using `reportValidity()`. It returns the same answer **and** pops up the browser's bubble on the first bad field, even though Q3 turned on `noValidate`.

---

## Tier 2: Easy

### Q6. Mark a field as touched on `blur`

**Look at the HTML and CSS:** `#b-email` is `required` and `type="email"`. In `styles.css`: `input.touched:invalid { border: 2px solid #dc2626; ... }`.

```js
const bEmail = document.querySelector('#b-email');
bEmail.addEventListener('blur', () => {
  bEmail.classList.add('touched');
});
```

**Step by step**
1. `blur` fires when the cursor **leaves** the field (Tab or a click elsewhere).
2. Add `touched`. Now the CSS rule `input.touched:invalid` can match.

**Why this method:** `:invalid` alone would make the empty email red the moment the page loads, before the user has done anything. `.touched` means "only judge this field after the user has been in it".

**What you'll see:** click into Email, then Tab out: a red border. Type `a@b.ca`: green.

**Common mistake:** adding the class on `focus` instead. Then the field goes red the moment the user clicks into it, before they've typed a thing.

### Q7. Use `patternMismatch`

**Look at the HTML:** `#b-postal` has `pattern="[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d"`: letter, digit, letter, optional space, digit, letter, digit.

```js
const bPostal = document.querySelector('#b-postal');
const bPostalError = document.querySelector('#b-postal-error');
bPostal.addEventListener('input', () => {
  if (bPostal.validity.patternMismatch) {
    bPostalError.textContent = 'Use a postal code like T2N 1N4.';
  } else {
    bPostalError.textContent = '';
  }
});
```

**Step by step**
1. Listen for `input`, so it updates on every keystroke.
2. `patternMismatch` is `true` when the value doesn't match the `pattern`.
3. Show or clear the message.

**Why this method:** the rule already lives in the HTML. Reading the flag means you don't write the regular expression twice (and can't get the two out of step).

**What you'll see:** typing `T2N` shows the message; `T2N 1N4` or `t2n1n4` clears it. Empty clears it too: **an empty field passes `pattern`**. If the field had to be filled in, you'd add `required`.

**Common mistake:** expecting `pattern` to mean "contains". It must match the **whole** value: `T2N 1N4X` fails.

### Q8. `aria-invalid` and a message

**Look at the HTML:** `#b-phone` is `type="tel"` with `pattern="\d{3}-\d{3}-\d{4}"` and `aria-describedby="b-phone-error"`.

```js
const bPhone = document.querySelector('#b-phone');
const bPhoneError = document.querySelector('#b-phone-error');
bPhone.addEventListener('input', () => {
  const ok = bPhone.validity.valid;
  bPhone.setAttribute('aria-invalid', String(!ok));
  bPhoneError.textContent = ok ? '' : 'Use the format 403-555-0199.';
});
```

**Step by step**
1. `validity.valid` is `true` when **no** flag is broken.
2. `aria-invalid` tells screen readers the field has a problem. Attributes are text, so `String(!ok)` turns `true`/`false` into `"true"`/`"false"`.
3. The ternary (`condition ? a : b`) picks the message.

**Why it matters:** because of `aria-describedby="b-phone-error"`, a screen reader reads the error text along with the field, and `aria-invalid="true"` makes it say "invalid entry".

**What you'll see:** `4035550199` shows the message; `403-555-0199` clears it. In DevTools, watch `aria-invalid` flip.

**Common mistake:** thinking `type="tel"` checks anything. It doesn't (it only shows a phone keypad on mobile). All the checking here comes from `pattern`.

### Q9. Spaces-only: the gap in `required`

**Look at the HTML:** `<input id="b-nick" ... required value="   ">`. Three spaces.

```js
const bNick = document.querySelector('#b-nick');
const bNickError = document.querySelector('#b-nick-error');
function checkNick() {
  if (bNick.value.trim() === '') {
    bNick.setCustomValidity("Nickname can't be empty or just spaces.");
  } else {
    bNick.setCustomValidity('');
  }
  bNickError.textContent = bNick.validationMessage;
}
checkNick();
bNick.addEventListener('input', checkNick);
```

**Step by step**
1. `trim()` removes spaces from both ends. Three spaces become `''`.
2. If nothing is left, set a custom error. Otherwise **clear** it with `''`.
3. Show `validationMessage` (your text, or `''` when valid).
4. Call `checkNick()` once now, for the page's starting value, and again on every `input`.

**Why this method:** to the browser, `"   "` is not empty, so `valueMissing` is `false`. Try `bNick.validity.valueMissing` in the Console: `false`. `setCustomValidity` lets you add a rule the HTML can't express, and the field then really counts as invalid (`:invalid` matches, `checkValidity()` returns `false`).

**What you'll see:** the message straight away; type `Sam` and it disappears.

**Common mistake:** forgetting the `else`. Without `setCustomValidity('')`, the first error sticks forever: the message text would update, but the field would stay invalid.

### Q10. Read the whole form with `FormData`

**Look at the HTML:** every input in `#b-form` has a `name` (`email`, `postal`, `phone`, `nick`).

```js
const bForm = document.querySelector('#b-form');
const bOut = document.querySelector('#b-out');
bForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(bForm));
  bOut.textContent = JSON.stringify(data, null, 2);
});
```

**Step by step**
1. `preventDefault()` keeps the page from reloading.
2. `new FormData(bForm)` collects every field that has a `name`, as name/value pairs.
3. `Object.fromEntries(...)` turns those pairs into a normal object: `{ email: "...", postal: "...", ... }`.
4. `JSON.stringify(data, null, 2)` makes it readable (2-space indents).

**What you'll see:** something like `{ "email": "a@b.ca", "postal": "", "phone": "", "nick": "Sam" }`.

**Common mistake:** an input without a `name` is **left out**. `id` doesn't count. If your object is missing a key, check the HTML for `name="..."`. Also: every value is a **string**, even from a number box.

---

## Tier 3: Competent

These five build one complete, reusable validation system for the workshop form. It's the same shape as `demos/12-validation-api`.

### Q11. `messageFor(input)`: flags to friendly words

**Look at the HTML:** each input has `data-label` (`name`, `email`, `number of seats`, `website`) plus its rules (`required`, `minlength`, `type`, `min`/`max`/`step`).

```js
function messageFor(input) {
  const v = input.validity;
  const label = input.dataset.label;
  if (v.valid) return '';
  if (v.customError) return input.validationMessage;
  if (v.valueMissing) return `Please enter your ${label}.`;
  if (v.typeMismatch) return `Please enter a valid ${label}.`;
  if (v.tooShort) return `Use at least ${input.minLength} characters.`;
  if (v.rangeUnderflow) return `Choose at least ${input.min}.`;
  if (v.rangeOverflow) return `Choose ${input.max} or fewer.`;
  if (v.stepMismatch) return 'Use a whole number.';
  return input.validationMessage;
}
```

**Step by step**
1. `v` is a short name for the ValidityState.
2. `input.dataset.label` reads the `data-label` attribute.
3. Check the flags **in order** and return at the first one that's `true`. Order matters: an empty field is reported as "Please enter...", not "too short".
4. `customError` goes near the top so your own rules (Q12) show their own words.
5. `input.minLength`, `input.min` and `input.max` read the numbers straight off the HTML, so the message always matches the rule.
6. The last line is a safety net for any flag you didn't plan for.

**Why this method:** nothing in this function mentions a particular field. One function serves every input on the page, and on any future form.

**What you'll see:** in the Console, `messageFor(document.querySelector('#c-name'))` gives `Please enter your name.`

**Common mistake:** putting `valueMissing` after `tooShort` or `typeMismatch`. You'd get odd messages; for example, a half-typed email would say "Please enter your email." even though the user did enter something.

### Q12. `validate(input)`: check, show, report

```js
function validate(input) {
  input.setCustomValidity('');
  const value = input.value.trim();
  if (input.value !== '' && value === '') {
    input.setCustomValidity(`Please enter your ${input.dataset.label}.`);
  } else if (input.minLength > 0 && value !== '' && value.length < input.minLength) {
    input.setCustomValidity(`Use at least ${input.minLength} characters.`);
  }
  const message = messageFor(input);
  const errorBox = document.getElementById(input.getAttribute('aria-describedby'));
  errorBox.textContent = message;
  input.setAttribute('aria-invalid', String(message !== ''));
  return message === '';
}
```

**Step by step**
1. **Clear first.** Forget last time's custom error, so a fixed field can become valid again.
2. Spaces only (`"   "`)? The browser's `required` doesn't catch that, so add a custom error.
3. Trimmed value shorter than `minLength`? Add a custom error. Two reasons the browser's own `tooShort` isn't enough: it counts spaces (`"S "` is 2 characters), and it only checks text the user actually typed (if your code sets `.value`, `tooShort` stays `false`).
4. `input.minLength` is `-1` when there's no `minlength`, so `> 0` skips fields without one.
5. `messageFor` turns the flags (including your custom error) into words.
6. `aria-describedby` holds the error div's id, so `getElementById` finds the right box for any field. It's also the attribute screen readers use to read the error with the field.
7. Set `aria-invalid` and return `true` when there's no message.

**What you'll see:** `validate(document.querySelector('#c-name'))` with `S` in the box: returns `false` and shows `Use at least 2 characters.`

**Common mistake:** leaving out step 1. Once a custom error is set, the field stays invalid forever, even after the user fixes it.

### Q13. When to validate: `blur` and `input`

```js
const cForm = document.querySelector('#c-form');
const cFields = [...cForm.elements].filter((el) => el.matches('input'));
cFields.forEach((input) => {
  input.addEventListener('blur', () => {
    input.classList.add('touched');
    validate(input);
  });
  input.addEventListener('input', () => {
    if (input.classList.contains('touched')) validate(input);
  });
});
```

**Step by step**
1. `cForm.elements` holds every control in the form, **including the buttons**. `[...]` turns it into a real array, and `filter` keeps only the inputs.
2. On `blur` (leaving the field): mark it touched and validate. That's the moment the user says "I'm done with this one".
3. On `input` (each keystroke): validate only if it's already touched. That way an error disappears the moment it's fixed, but nobody is told "Please enter a valid email" after typing one letter.

**What you'll see:** type `s` in Email: no message. Tab away: `Please enter a valid email.` Go back and finish typing `sam@example.com`: the message disappears as soon as it's valid.

**Common mistake:** validating on `input` from the very first keystroke. It's technically right, but it feels like the form is shouting at you.

### Q14. Submit: check everything, focus the first problem

```js
const cStatus = document.querySelector('#c-status');
cForm.addEventListener('submit', (event) => {
  event.preventDefault();
  cFields.forEach((input) => input.classList.add('touched'));
  const invalid = cFields.filter((input) => !validate(input));
  if (invalid.length > 0) {
    cStatus.textContent = `Please fix ${invalid.length} field${invalid.length === 1 ? '' : 's'}.`;
    cStatus.className = 'bad';
    invalid[0].focus();
    return;
  }
  // Q15 continues here
});
```

**Step by step**
1. Stop the reload.
2. Mark **every** field touched: the user is asking "is it all OK?", so show every problem, even in fields they skipped.
3. `filter((input) => !validate(input))` runs `validate` on **every** field (so every message appears) and keeps the ones that failed.
4. If any failed: show how many, colour it with `bad`, and `focus()` the first one. Focus moves the cursor there, scrolls it into view, and tells a screen reader user where to go.
5. `return` stops the handler.

**What you'll see:** submit the empty form: `Please fix 3 fields.` (name, email and seats are required; the website is optional) and the cursor jumps to Name. `#c-status` has `aria-live="polite"`, so screen readers announce it.

**Common mistake:** `if (!validate(a) || !validate(b) || !validate(c)) return;` or `cFields.every(validate)`. Both **stop at the first failure** (short-circuit), so only one message shows.

### Q15. Success, then a clean reset

```js
  // inside the submit handler, after the invalid check:
  const data = Object.fromEntries(new FormData(cForm));
  const seats = Number(data.seats);
  cForm.reset();
  cStatus.textContent = `Booked ${seats} seat${seats === 1 ? '' : 's'} for ${data.name.trim()}.`;
  cStatus.className = 'ok';
```

```js
cForm.addEventListener('reset', () => {
  cFields[0].focus();
  cFields.forEach((input) => {
    input.setCustomValidity('');
    input.classList.remove('touched');
    input.removeAttribute('aria-invalid');
    document.getElementById(input.getAttribute('aria-describedby')).textContent = '';
  });
  cStatus.textContent = '';
  cStatus.className = '';
});
```

**Step by step**
1. Read all values **before** resetting (afterwards they're gone).
2. `Number(data.seats)`: FormData values are strings.
3. `cForm.reset()` puts the values back to the start. It also fires the `reset` event, so the listener runs.
4. Set the success message **after** the reset, because the reset listener clears `#c-status`.
5. The `reset` listener cleans up what `reset()` doesn't: custom errors, `touched`, `aria-invalid` and the messages.
6. It moves focus **first**. Moving focus fires `blur` on the field you were in, and our Q13 blur listener would mark it touched again. Doing it first means the clean-up runs last and wins.

**Why a `reset` listener:** the **Clear** button and `cForm.reset()` both trigger it, so the clean-up lives in one place.

**What you'll see:** fill in ` Sam `, `sam@example.com`, `2`, then Book: `Booked 2 seats for Sam.`, empty boxes, no colours, cursor in Name.

**Common mistake:** assuming `form.reset()` clears everything. It only clears **values**. Without the listener, a field with an old custom error stays `:invalid`, and old messages stay on screen.

---

## Tier 4: Advanced

### Q16. Cross-field rule: confirm the password

```js
const dPass = document.querySelector('#d-pass');
const dConfirm = document.querySelector('#d-confirm');
const dConfirmError = document.querySelector('#d-confirm-error');
function checkConfirm() {
  if (dConfirm.value !== '' && dConfirm.value !== dPass.value) {
    dConfirm.setCustomValidity('Passwords do not match.');
  } else {
    dConfirm.setCustomValidity('');
  }
  dConfirmError.textContent = dConfirm.value === '' ? '' : dConfirm.validationMessage;
}
dConfirm.addEventListener('input', checkConfirm);
dPass.addEventListener('input', checkConfirm);
```

**Step by step**
1. HTML can't compare two fields, so this is a custom rule.
2. Only complain when the confirm box has something in it and differs.
3. While the confirm box is empty, show nothing (its `required` still makes it invalid for the Q18 summary).
4. Listen on **both** fields.

**Why both listeners:** type password `abcdefg1`, confirm `abcdefg2`: "do not match". Now change the **password** to `abcdefg2`. With only the confirm listener, the error would stay, even though they now match.

**Common mistake:** comparing trimmed values. Spaces can be a real part of a password, so compare exactly.

### Q17. Dates: return after departure

```js
const dFrom = document.querySelector('#d-from');
const dTo = document.querySelector('#d-to');
const dToError = document.querySelector('#d-to-error');
function checkDates() {
  dTo.min = dFrom.value;
  const bad = dFrom.value !== '' && dTo.value !== '' && dTo.value <= dFrom.value;
  dTo.setCustomValidity(bad ? 'Return date must be after the departure date.' : '');
  dToError.textContent = bad ? dTo.validationMessage : '';
}
dFrom.addEventListener('input', checkDates);
dTo.addEventListener('input', checkDates);
```

**Step by step**
1. `dTo.min = dFrom.value` greys out earlier days in the date picker and turns on `rangeUnderflow` for earlier dates.
2. Date values are always `YYYY-MM-DD`, whatever the screen shows, so comparing the **strings** compares the dates (`'2026-12-01' <= '2026-12-10'` is `true`).
3. `<=` catches the same day too, which `min` allows.
4. Set or clear the custom error, and show it.

**What you'll see:** departure `2026-12-10`, return `2026-12-10`: the message. Return `2026-12-20`: no message.

**Common mistake:** comparing `new Date(...)` objects with `===`. Two Date objects are never `===`, even for the same day. The ISO strings are simpler here.

### Q18. An error summary

```js
const dForm = document.querySelector('#d-form');
const dSummaryList = document.querySelector('#d-summary-list');
const dDone = document.querySelector('#d-done');
dForm.addEventListener('submit', (event) => {
  event.preventDefault();
  checkConfirm();
  checkDates();
  const invalid = [...dForm.elements].filter((el) => el.matches('input') && !el.validity.valid);
  const items = invalid.map((input) => {
    const li = document.createElement('li');
    const link = document.createElement('button');
    link.type = 'button';
    link.textContent = `${input.labels[0].textContent}: ${input.validationMessage}`;
    link.addEventListener('click', () => input.focus());
    li.append(link);
    return li;
  });
  dSummaryList.replaceChildren(...items);
  if (invalid.length > 0) {
    dDone.textContent = '';
    invalid[0].focus();
  } else {
    dDone.textContent = 'Trip saved.';
  }
});
```

**Step by step**
1. Run the custom checks first, so their custom errors are up to date.
2. Keep the inputs that aren't valid.
3. For each, build an `li` with a `button`. `input.labels` is the list of `<label>`s connected to that input (via `for`), so `labels[0].textContent` is its visible name.
4. `link.type = 'button'`: a button inside a form is a **submit** button by default. Here the button is outside the form, but setting the type is a good habit.
5. `replaceChildren(...items)` swaps the old list for the new one in one step: no duplicates.
6. Focus the first problem, or say `Trip saved.`

**What you'll see:** with mismatched passwords and a bad return date, two clickable lines like `Confirm password: Passwords do not match.` Click one and the cursor jumps to that field. Empty required fields show the browser's own text ("Please fill out this field."), since this question uses `validationMessage`; Q11's `messageFor` would give friendlier words.

**Common mistake:** `dSummaryList.append(...items)` without clearing. Each submit adds another copy of every error.

### Q19. A validity inspector with `for...in`

```js
const dProbe = document.querySelector('#d-probe');
const dFlags = document.querySelector('#d-flags');
function showFlags() {
  const items = [];
  for (const flag in dProbe.validity) {
    if (dProbe.validity[flag]) {
      const li = document.createElement('li');
      li.textContent = flag;
      items.push(li);
    }
  }
  dFlags.replaceChildren(...items);
}
showFlags();
dProbe.addEventListener('input', showFlags);
```

**Step by step**
1. `for (const flag in dProbe.validity)` visits every flag **name**: `valueMissing`, `typeMismatch`, ... `valid`.
2. `dProbe.validity[flag]` uses square brackets because the name is in a variable.
3. Make an `li` for each one that's `true`, then swap them in.

**What you'll see:** at first `valueMissing`. Type `abc-1234`: `patternMismatch`. Type `ABC-1234`: just `valid`. This is a small version of the inspector panel in `demos/12-validation-api`.

**Common mistake:** `Object.keys(dProbe.validity)`. It gives `[]`, because the flags live on the ValidityState prototype, not on the object itself. `for...in` walks the prototype too.

### Q20. Disable the button until the form is valid

```js
const d2Form = document.querySelector('#d2-form');
const d2Submit = document.querySelector('#d2-submit');
const d2Out = document.querySelector('#d2-out');
d2Submit.disabled = !d2Form.checkValidity();
d2Form.addEventListener('input', () => {
  d2Submit.disabled = !d2Form.checkValidity();
});
d2Form.addEventListener('submit', (event) => {
  event.preventDefault();
  d2Out.textContent = 'Subscribed!';
  d2Form.reset();
  d2Submit.disabled = true;
});
```

**Step by step**
1. Set the button's starting state.
2. **One** listener on the form: `input` events **bubble** up from every field (including the checkbox), so the form hears them all. That's event delegation.
3. `checkValidity()` is the quiet check: no bubbles.
4. After a successful submit, reset and disable again (`reset()` doesn't fire `input`).

**Why some designers avoid it:** a disabled button can't explain itself. Users (especially screen-reader users, since disabled buttons are often skipped) can't tell *what* is missing. The friendlier pattern is Q14: let them press Submit and show every error. Disabling works best on very short forms like this one.

**Common mistake:** a separate listener on each field that only checks *that* field. The button must depend on the **whole** form.

---

## Tier 5: Applied

### Q21. Pizza toppings: a rule for a group of checkboxes

**Which technique?** No HTML attribute means "at least one in this group" (`required` on a checkbox means "**this** box must be ticked"). So: count in JavaScript, and use `setCustomValidity` on one box so the form really is invalid.

```js
const pizzaForm = document.querySelector('#e-pizza-form');
const toppingBoxes = [...pizzaForm.querySelectorAll('input[name="topping"]')];
const toppingsError = document.querySelector('#e-toppings-error');
const pizzaOut = document.querySelector('#e-pizza-out');
function checkToppings() {
  const count = toppingBoxes.filter((box) => box.checked).length;
  let message = '';
  if (count === 0) message = 'Choose at least one topping.';
  else if (count > 3) message = `Choose up to 3 toppings (you have ${count}).`;
  toppingBoxes[0].setCustomValidity(message);
  toppingsError.textContent = message;
  return message === '';
}
pizzaForm.addEventListener('change', checkToppings);
pizzaForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!checkToppings()) {
    toppingBoxes[0].focus();
    return;
  }
  const toppings = new FormData(pizzaForm).getAll('topping');
  pizzaOut.textContent = `Ordered: ${toppings.join(', ')}`;
});
```

**Step by step**
1. Get all the topping boxes as an array.
2. Count the ticked ones with `filter(...).length`.
3. Pick a message (or `''`), set it as the custom error on the **first** box, and show it.
4. `change` bubbles, so one listener on the form hears every box.
5. On submit, check again; if OK, `FormData.getAll('topping')` returns **every** ticked value with that name, as an array, in page order.

**What you'll see:** submit with none: `Choose at least one topping.` Tick four: `Choose up to 3 toppings (you have 4).` Tick Mushroom and Olive and order: `Ordered: Mushroom, Olive`.

**Common mistake:** `Object.fromEntries(new FormData(form))` here. Several boxes share the name `topping`, and an object can hold only one value per key, so you'd lose all but the last. Use `getAll`.

### Q22. Promo codes: forgiving input

**Which technique?** `pattern` can't look things up in a list, and you want to forgive case and spaces. So: normalise the text (`trim().toUpperCase()`), look it up in an object, and use `setCustomValidity` for unknown codes.

```js
const promo = document.querySelector('#e-promo');
const promoMsg = document.querySelector('#e-promo-msg');
const PROMO_CODES = { SAVE10: 10, STUDENT: 15 };
promo.addEventListener('input', () => {
  const code = promo.value.trim().toUpperCase();
  if (code === '') {
    promo.setCustomValidity('');
    promoMsg.textContent = '';
    promoMsg.className = 'error-message';
  } else if (code in PROMO_CODES) {
    promo.setCustomValidity('');
    promoMsg.textContent = `${PROMO_CODES[code]}% off applied.`;
    promoMsg.className = 'ok';
  } else {
    promo.setCustomValidity('Unknown promo code.');
    promoMsg.textContent = promo.validationMessage;
    promoMsg.className = 'error-message';
  }
});
```

**Step by step**
1. An object maps each code to its discount.
2. Normalise what they typed: ` student ` becomes `STUDENT`.
3. Empty: optional, so clear everything. Known (`code in PROMO_CODES`): clear the error and show the discount in green. Unknown: set the custom error and show it.
4. `className` swaps the colour class.

**What you'll see:** ` student ` → `15% off applied.`; `nope` → `Unknown promo code.`

**Common mistake:** comparing the raw value (`promo.value === 'SAVE10'`). Real users type `save10 `, and they'd be told their valid code is wrong.

(In a real shop the server must check the code again. Anyone can read this list in DevTools.)

### Q23. Fix the bugs

```js
const rsvpForm = document.querySelector('#e-rsvp-form');
const guest = document.querySelector('#e-guest');
const guestCount = document.querySelector('#e-count');
const rsvpOut = document.querySelector('#e-rsvp-out');

function check(input) {
  input.setCustomValidity('');                                           // fix 3: clear first
  if (input === guest && input.value.trim().length < 2) {
    input.setCustomValidity('Please enter a name (2+ letters).');
  }
  input.nextElementSibling.textContent = input.validationMessage;        // fix 2: show AFTER setting
  return input.validity.valid;
}

rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // fix 1: no reportValidity()
  const okGuest = check(guest);                                          // fix 4: check both
  const okCount = check(guestCount);
  if (!okGuest || !okCount) return;
  rsvpOut.textContent = `RSVP saved: ${guest.value.trim()}, ${guestCount.value} people.`;
  rsvpForm.reset();
});
```

**The four causes**
1. **The bubble:** `rsvpForm.reportValidity()` always shows the browser's bubble, `novalidate` or not. And because it returns `false` for empty fields, the handler stopped **before** `check()` ever wrote a message. Remove it: `check()` does the job.
2. **One submit late:** `check()` wrote `validationMessage` to the page **before** setting the custom error, so it showed the *previous* state. Set first, show second.
3. **Stuck after fixing:** the custom error was never cleared. `Sam` passed the `if`, but the old "2+ letters" error was still there. Start with `setCustomValidity('')`.
4. **Only one message:** `!check(guest) || !check(guestCount)` stops at the first `true` (short-circuit), so `check(guestCount)` never runs when the name is wrong. Call both first, then decide.

**What you'll see after fixing:** submit empty: a message under **both** fields, no bubble. `Sam` and `3`: `RSVP saved: Sam, 3 people.`

**Common mistake when fixing:** swapping `reportValidity()` for `checkValidity()` and keeping the early `return`. No bubble, but empty fields still never get their messages, because `check()` doesn't run.

(Why doesn't this fix need a `reset` listener? Because by the time the form resets, both fields are valid and `check()` has already cleared the custom error. If your form can be reset while a field still has a custom error, such as with a Clear button, add one like Q15's.)

### Q24. Phone numbers people actually type

**Which technique?** A `pattern` would reject `(403) 555 0199`, which is a perfectly good number. Better: accept anything, **clean it up** in JavaScript, and only complain if it can't be fixed. `blur` is the right moment: rewriting the box while someone is typing moves their cursor around.

```js
const phone = document.querySelector('#e-phone');
const phoneError = document.querySelector('#e-phone-error');
phone.addEventListener('blur', () => {
  let digits = phone.value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (phone.value.trim() === '') {
    phone.setCustomValidity('');
  } else if (digits.length === 10) {
    phone.value = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    phone.setCustomValidity('');
  } else {
    phone.setCustomValidity('Enter a 10-digit phone number.');
  }
  phoneError.textContent = phone.validationMessage;
});
```

**Step by step**
1. `replace(/\D/g, '')` deletes every character that isn't a digit (`\D` = "not a digit", `g` = everywhere).
2. North American numbers are sometimes typed with a leading `1`: drop it when there are 11 digits.
3. Empty: fine, it's optional.
4. Ten digits: rebuild it with `slice` as `403-555-0199` and write it back into the box.
5. Anything else: custom error.

**What you'll see:** type `(403) 555 0199`, Tab away: the box now says `403-555-0199`. `555-0199` → `Enter a 10-digit phone number.`

**Common mistake:** doing this on `input`. Each keystroke rewrites the value and the cursor jumps to the end, which makes editing the middle of the number impossible.

### Q25. Only save real changes

**Which technique?** "Has anything changed?" means comparing **now** with **then**. `FormData` gives you all the values at once; `JSON.stringify` turns them into one string that's easy to compare.

```js
const profileForm = document.querySelector('#e-profile-form');
const saveButton = document.querySelector('#e-save');
const profileOut = document.querySelector('#e-profile-out');
const snapshot = () => JSON.stringify(Object.fromEntries(new FormData(profileForm)));
let saved = snapshot();

function updateSave() {
  const changed = snapshot() !== saved;
  saveButton.disabled = !(changed && profileForm.checkValidity());
}
updateSave();
profileForm.addEventListener('input', () => {
  updateSave();
  profileOut.textContent = '';
});
profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (saveButton.disabled) return;
  saved = snapshot();
  profileOut.textContent = 'Saved.';
  updateSave();
});
```

**Step by step**
1. `snapshot()` returns the whole form as one string, like `{"display":"Sam Lee","city":"Calgary","news":"on"}`.
2. Take a snapshot at load: that's "what was last saved".
3. On every `input`, compare the current snapshot with the saved one, and check validity. Enable the button only if both are good.
4. On submit, the current values **become** the saved values, so the button disables again.
5. The `if (saveButton.disabled) return;` guard is cheap insurance: a form can still be submitted by code (`form.requestSubmit()`) or by another button added later, even while this button is disabled.

**What you'll see:** at first, disabled. Change the city: enabled. Change it back to `Calgary`: disabled again. Clear the display name: disabled (invalid). Untick the checkbox: enabled. Save: `Saved.` and disabled.

**Common mistake:** a `let changed = false` that you set to `true` on any `input`. Then changing the city and changing it back still counts as "changed". Comparing snapshots checks what really matters: is it different **now**?

(Note: an unticked checkbox simply disappears from `FormData`, so the snapshot changes from `"news":"on"` to no `news` key at all. The comparison still works.)

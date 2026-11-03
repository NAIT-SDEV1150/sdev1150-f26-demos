// Demo 12: the Constraint Validation API
// The HTML holds the rules (required, minlength, pattern, type, min/max).
// JavaScript reads input.validity, turns it into friendly words, and decides
// WHEN to show them: after a field is touched, as you type, and on submit.

const form = document.querySelector('#signup');
const formStatus = document.querySelector('#form-status');
const result = document.querySelector('#result');
const passwordInput = document.querySelector('#password');
const confirmInput = document.querySelector('#confirm');

// Every control we validate. form.elements also holds the buttons, so keep
// only inputs, selects and textareas.
const fields = [...form.elements].filter((el) => el.matches('input, select, textarea'));

// The error div for a field lives inside the same .field wrapper.
// (When the div comes straight after the input, input.nextElementSibling works too.)
const errorFor = (input) => input.closest('.field').querySelector('.error-message');

// "full name" -> "Full name"
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// ---------------------------------------------------------------------------
// 1. Rules the HTML can't express. Return a message, or '' for "no problem".
// ---------------------------------------------------------------------------
function customRule(input) {
  if (input.type === 'checkbox') return '';
  const value = input.type === 'password' ? input.value : input.value.trim();

  // required is happy with "   ", so catch spaces-only ourselves
  if (input.required && input.value !== '' && value === '') {
    return `Please enter your ${input.dataset.label}.`;
  }
  // minlength counts spaces and only checks what the user typed, so check the trimmed length too
  if (input.minLength > 0 && value !== '' && value.length < input.minLength) {
    return `${capitalize(input.dataset.label)} must be at least ${input.minLength} characters (you have ${value.length}).`;
  }
  // Cross-field rule: the confirmation must match the password
  if (input === confirmInput && input.value !== '' && input.value !== passwordInput.value) {
    return 'Passwords do not match.';
  }
  return '';
}

// ---------------------------------------------------------------------------
// 2. Turn the ValidityState flags into one friendly message.
//    Order matters: the first true flag wins.
// ---------------------------------------------------------------------------
function messageFor(input) {
  const v = input.validity;
  const label = input.dataset.label;
  const Label = capitalize(label);

  if (v.valid) return '';
  if (v.customError) return input.validationMessage;   // our own words from setCustomValidity
  if (v.valueMissing) {
    return input.type === 'checkbox' ? 'Please tick this box to continue.' : `Please enter your ${label}.`;
  }
  if (v.badInput) return `Please enter a valid ${label}.`;          // e.g. half a date
  if (v.typeMismatch) {
    return input.type === 'email'
      ? 'Enter an email like name@example.com.'
      : 'Enter a full web address, starting with https://';
  }
  if (v.tooShort) return `${Label} must be at least ${input.minLength} characters.`;
  if (v.tooLong) return `${Label} must be ${input.maxLength} characters or fewer.`;
  if (v.patternMismatch) return input.dataset.patternMessage || `Please match the format for ${label}.`;
  if (v.rangeUnderflow) {
    return input.type === 'date' ? `${Label} must be on or after ${input.min}.` : `${Label} must be at least ${input.min}.`;
  }
  if (v.rangeOverflow) {
    return input.type === 'date' ? `${Label} must be on or before ${input.max}.` : `${Label} must be ${input.max} or less.`;
  }
  if (v.stepMismatch) return `${Label} must be a whole number.`;
  return input.validationMessage;                      // anything we didn't plan for
}

// ---------------------------------------------------------------------------
// 3. One reusable validate(input): check, show, report. Returns true/false.
// ---------------------------------------------------------------------------
function validate(input) {
  input.setCustomValidity('');                  // forget last time's custom error FIRST
  const custom = customRule(input);
  if (custom) input.setCustomValidity(custom);  // add ours on top of the HTML rules

  const message = messageFor(input);
  errorFor(input).textContent = message;        // the text the user sees
  input.setAttribute('aria-invalid', String(message !== ''));  // what a screen reader hears
  showValidity(input);
  return message === '';
}

// ---------------------------------------------------------------------------
// 4. WHEN to validate
// ---------------------------------------------------------------------------
fields.forEach((input) => {
  // Leaving a field (blur) means "I'm done here": from now on, show its errors.
  input.addEventListener('blur', () => {
    input.classList.add('touched');
    validate(input);
  });

  // While typing: only re-check fields the user has already left once,
  // so we don't shout "Please enter your email" after the first letter.
  input.addEventListener('input', () => {
    if (input.classList.contains('touched')) validate(input);
    else showValidity(input);

    // Changing the password can make the confirmation right or wrong
    if (input === passwordInput && confirmInput.classList.contains('touched')) validate(confirmInput);
  });

  // A checkbox is "done" as soon as it is clicked
  if (input.type === 'checkbox') {
    input.addEventListener('change', () => {
      input.classList.add('touched');
      validate(input);
    });
  }

  input.addEventListener('focus', () => showValidity(input));
});

// Submit: check EVERY field (not just the first bad one), then focus the first problem.
form.addEventListener('submit', (event) => {
  event.preventDefault();                       // stay on the page

  fields.forEach((input) => input.classList.add('touched'));
  const invalid = fields.filter((input) => !validate(input));

  if (invalid.length > 0) {
    formStatus.textContent = `Please fix ${invalid.length} field${invalid.length === 1 ? '' : 's'}.`;
    formStatus.className = 'bad';
    invalid[0].focus();                         // take the user to the first problem
    return;
  }

  // Valid: read every named field in one go
  const data = Object.fromEntries(new FormData(form));
  delete data.password;                         // never print passwords on the page
  delete data.confirm;
  result.textContent = JSON.stringify(data, null, 2);

  form.reset();                                 // fires the 'reset' listener below
  formStatus.textContent = `Account created for ${data.username}.`;
  formStatus.className = 'ok';
});

// form.reset() clears VALUES only. Custom validity, classes, messages and
// aria-invalid all survive it, so clean them up here. This runs for the Clear
// button AND for form.reset() above.
form.addEventListener('reset', () => {
  // Move focus FIRST: moving it fires 'blur' on the field you were in, which
  // would mark it touched. Doing it before the clean-up means the clean-up wins.
  fields[0].focus();
  fields.forEach((input) => {
    input.setCustomValidity('');
    input.classList.remove('touched');
    input.removeAttribute('aria-invalid');
    errorFor(input).textContent = '';
  });
  formStatus.textContent = '';
  formStatus.className = '';
});

// ---------------------------------------------------------------------------
// 5. checkValidity() vs reportValidity()
// ---------------------------------------------------------------------------
document.querySelector('#btn-check').addEventListener('click', () => {
  // Quiet: returns true/false, shows nothing. Only knows the HTML rules
  // plus any custom errors already set.
  const ok = form.checkValidity();
  formStatus.textContent = `form.checkValidity() returned ${ok}`;
  formStatus.className = ok ? 'ok' : 'bad';
});

document.querySelector('#btn-report').addEventListener('click', () => {
  // Loud: returns true/false AND shows the browser's bubble on the first bad
  // field, even though the form has novalidate.
  const ok = form.reportValidity();
  formStatus.textContent = `form.reportValidity() returned ${ok}`;
  formStatus.className = ok ? 'ok' : 'bad';
});

// ---------------------------------------------------------------------------
// The inspector: shows input.validity for the field you are in
// ---------------------------------------------------------------------------
const FLAGS = ['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong',
  'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput', 'customError', 'valid'];
const inspectName = document.querySelector('#inspect-name');
const inspectValue = document.querySelector('#inspect-value');
const inspectRows = document.querySelector('#inspect-rows');
const inspectMessage = document.querySelector('#inspect-message');

function showValidity(input) {
  inspectName.textContent = `#${input.id}`;
  inspectValue.textContent = input.type === 'checkbox' ? `checked: ${input.checked}` : JSON.stringify(input.value);
  inspectMessage.textContent = JSON.stringify(input.validationMessage);
  const rows = FLAGS.map((flag) => {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const value = document.createElement('td');
    name.textContent = flag;
    value.textContent = String(input.validity[flag]);
    row.classList.toggle('on', input.validity[flag]);
    row.classList.toggle('valid-row', flag === 'valid');
    row.append(name, value);
    return row;
  });
  inspectRows.replaceChildren(...rows);
}

fields[0].focus();

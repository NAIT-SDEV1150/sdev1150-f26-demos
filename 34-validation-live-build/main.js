// Validation: live build. Uncomment or write each step as we go.

const form = document.querySelector('#join');
const nameInput = document.querySelector('#name');
const email = document.querySelector('#email');
const age = document.querySelector('#age');
const password = document.querySelector('#password');
const confirmInput = document.querySelector('#confirm');
const output = document.querySelector('#output');
const fields = [nameInput, email, age, password, confirmInput];

// Step 2: peek at the report card. Type in a field, then run this in the Console:
//   nameInput.validity       nameInput.checkValidity()       nameInput.validationMessage

// Step 4: our own rules (HTML can't do these). Return a message, or '' when OK.
// function extraRule(input) {
//   if (input === nameInput && input.value.trim().length < 2) return 'Name needs at least 2 letters.';
//   if (input === password && !/[0-9]/.test(input.value)) return 'Include at least one number.';
//   if (input === confirmInput && input.value !== password.value) return 'Passwords do not match.';
//   return '';
// }

// Step 4b: one validate() for every field
// function validate(input) {
//   input.setCustomValidity('');                     // clear our old message
//   if (input.validity.valid) {                      // HTML rules pass? then check ours
//     input.setCustomValidity(extraRule(input));
//   }
//   input.nextElementSibling.textContent = input.validationMessage;
//   input.classList.add('touched');
//   return input.checkValidity();
// }

// Step 4c: check on every keystroke
// fields.forEach((input) => input.addEventListener('input', () => validate(input)));

// Step 6: on submit
// form.addEventListener('submit', (event) => {
//   event.preventDefault();
//   fields.forEach(validate);
//   if (!form.checkValidity()) {
//     form.querySelector(':invalid').focus();
//     output.textContent = 'Not sent: fix the fields above.';
//     return;
//   }
//   const data = Object.fromEntries(new FormData(form));
//   delete data.password; delete data.confirm;
//   output.textContent = 'Would send:\n' + JSON.stringify(data, null, 2);
// });

// Gotcha: reset() keeps custom messages, so clear them ourselves
// document.querySelector('#reset').addEventListener('click', () => {
//   form.reset();
//   fields.forEach((input) => {
//     input.setCustomValidity('');
//     input.classList.remove('touched');
//     input.nextElementSibling.textContent = '';
//   });
//   output.textContent = '';
//   nameInput.focus();
// });

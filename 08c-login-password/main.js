// Step 3: two fields. Check both when the form is submitted.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const message = document.querySelector('#message');

form.addEventListener('submit', (event) => {
  event.preventDefault();               // don't reload the page
  const name = username.value.trim();
  const pass = password.value;          // don't trim passwords: spaces count

  if (name.length < 3) {
    message.textContent = 'Username must be at least 3 letters.';
  } else if (pass.length < 8) {
    message.textContent = 'Password must be at least 8 characters.';
  } else {
    message.textContent = `Welcome, ${name}!`;
  }
});

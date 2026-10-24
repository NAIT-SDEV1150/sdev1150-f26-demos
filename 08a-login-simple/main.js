// Step 1: the simplest form check.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const message = document.querySelector('#message');

form.addEventListener('submit', (event) => {
  event.preventDefault();               // don't reload the page

  const name = username.value.trim();   // what was typed, without spaces

  if (name === '') {
    message.textContent = 'Please type a username.';
  } else if (name.length < 3) {
    message.textContent = 'Username must be at least 3 letters.';
  } else {
    message.textContent = `Welcome, ${name}!`;
  }
});

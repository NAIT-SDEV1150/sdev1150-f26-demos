// Step 2: the same check, but it runs on every keystroke.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const message = document.querySelector('#message');

// 'input' fires every time the text in the box changes
username.addEventListener('input', () => {
  const name = username.value.trim();
  if (name === '') {
    message.textContent = 'Please type a username.';
  } else if (name.length < 3) {
    message.textContent = 'Username must be at least 3 letters.';
  } else {
    message.textContent = 'Looks good!';
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();               // don't reload the page
  const name = username.value.trim();
  if (name.length < 3) {
    message.textContent = 'Fix the username first.';
  } else {
    message.textContent = `Welcome, ${name}!`;
  }
});

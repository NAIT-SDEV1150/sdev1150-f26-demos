// Step 4: move each rule into a function, then check the account.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const message = document.querySelector('#message');

// Pretend "database" of one account
const ACCOUNT = { username: 'student1', password: 'Secret123' };

// Each rule returns a message, or '' when the value is OK
function checkUsername(value) {
  if (value === '') return 'Please type a username.';
  if (value.length < 3) return 'Username must be at least 3 letters.';
  return '';
}

function checkPassword(value) {
  if (value === '') return 'Please type a password.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();               // don't reload the page
  const name = username.value.trim();
  const pass = password.value;

  // 1. Are the fields filled in properly?
  const problem = checkUsername(name) || checkPassword(pass);   // first non-empty message
  if (problem !== '') {
    message.textContent = problem;
    return;                             // stop here
  }

  // 2. Is it the right account?
  if (name === ACCOUNT.username && pass === ACCOUNT.password) {
    message.textContent = `Welcome back, ${name}!`;
    form.reset();
  } else {
    message.textContent = 'Wrong username or password.';
    password.value = '';
    password.focus();
  }
});

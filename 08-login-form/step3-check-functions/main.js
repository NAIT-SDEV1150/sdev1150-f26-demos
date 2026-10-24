// Step 3: move each rule into its own function.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const result = document.querySelector('#result');

// Each rule returns a message, or '' when the value is OK.
// 'return' leaves the function right away (an early exit).
function checkUsername(value) {
  if (value === '') return 'Please enter your username.';
  if (value.length < 3) return 'Username must be at least 3 characters.';
  return '';
}

function checkPassword(value) {
  if (value === '') return 'Please enter your password.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const userMessage = checkUsername(username.value.trim());
  const passMessage = checkPassword(password.value);

  // Show each message in the empty <div> right after its input
  username.nextElementSibling.textContent = userMessage;
  password.nextElementSibling.textContent = passMessage;

  if (userMessage === '' && passMessage === '') {
    result.textContent = `Welcome, ${username.value.trim()}!`;
  } else {
    result.textContent = 'Please fix the fields above.';
  }
});

// Demo 8: a login form that checks as you type, then checks the account on submit.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const result = document.querySelector('#result');

// Pretend "database" of one account
const ACCOUNT = { username: 'student1', password: 'Secret123' };

// Each rule returns a message, or '' when the value is OK
function checkUsername(value) {
  if (value === '') return 'Please enter your username.';
  if (!/^[A-Za-z]/.test(value)) return 'Username must start with a letter.';
  if (value.length < 3) return 'Username must be at least 3 characters.';
  return '';
}
function checkPassword(value) {
  if (value === '') return 'Please enter your password.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[0-9]/.test(value)) return 'Password must include a number.';
  return '';
}

// Show the message under the input and mark the input valid/invalid
function validate(input, checkFn) {
  const message = checkFn(input.value.trim());
  input.setCustomValidity(message);                  // '' = valid, anything else = invalid
  input.nextElementSibling.textContent = input.validationMessage;
  input.classList.add('touched');                    // only colour fields after typing
  return message === '';
}

username.addEventListener('input', () => validate(username, checkUsername));
password.addEventListener('input', () => validate(password, checkPassword));

form.addEventListener('submit', (event) => {
  event.preventDefault();                            // stay on the page
  const okUser = validate(username, checkUsername);
  const okPass = validate(password, checkPassword);
  if (!okUser || !okPass) {
    result.textContent = 'Please fix the highlighted fields.';
    result.className = 'bad';
    return;
  }
  // The fields look right. Now: is it the right account?
  if (username.value.trim() !== ACCOUNT.username) {
    result.textContent = 'No account with that username.';
    result.className = 'bad';
  } else if (password.value !== ACCOUNT.password) {
    result.textContent = 'Wrong password. Try again.';
    result.className = 'bad';
    password.value = '';
    password.focus();
  } else {
    result.textContent = `Welcome back, ${ACCOUNT.username}!`;
    result.className = 'ok';
    form.reset();
    [username, password].forEach((input) => {
      input.setCustomValidity('');
      input.classList.remove('touched');
      input.nextElementSibling.textContent = '';
    });
    username.focus();
  }
});

username.focus();

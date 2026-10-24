// Step 2: check the values with if / else if / else.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const result = document.querySelector('#result');

function checkUsername(username) {
  if (username === '') {return  'Please enter your username.';} 
  if (username.length < 3) {return 'Username must be at least 3 characters.';}
  return '';
}

function checkPassword(password) {
  
  let message = '';
  if (password === '') {
    message ='Please enter your password.';
  } else if (password.length < 8) {
    message = 'Password must be at least 8 characters.';
  } else {
    message = "";
  }
  return message;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = username.value.trim();
  const pass = password.value;

  result.textContent = checkUsername(name) || checkPassword(name)
});

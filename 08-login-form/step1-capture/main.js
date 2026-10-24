// Step 1: capture the form submit and read what was typed.
const form = document.querySelector('#login-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const result = document.querySelector('#result');



// 'submit' catches both the button click and pressing Enter
form.addEventListener('submit',  (event) => {

  event.preventDefault();                  // stay on the page (no reload)

  const name = username.value.trim();      // what was typed, without extra spaces
  const pass = password.value;

  result.textContent = `You typed "${name}" and a password ${pass.length} characters long.`;

});

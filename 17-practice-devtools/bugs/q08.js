// Q8: the counter breaks on the first click. Fix it.
const button = document.querySelector('#q8-button');
const output = document.querySelector('#q8-output');

const clicks = 0;

button.addEventListener('click', () => {
  clicks = clicks + 1;
  output.textContent = `Clicked ${clicks} times`;
});

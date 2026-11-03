// Q22: "+1 coffee" should count up in the Q22 box. Nothing visible happens, and there's no error.
const plusButton = document.querySelector('#q22-plus');
const countSpan = document.querySelector('.count');

let coffees = 0;

plusButton.addEventListener('click', () => {
  coffees += 1;
  countSpan.textContent = coffees;
});

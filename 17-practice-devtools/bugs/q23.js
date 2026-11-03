// Q23: add a coffee to the cart, reload the page, add another... and it breaks. Fix it.
const addButton = document.querySelector('#q23-add');
const clearButton = document.querySelector('#q23-clear');
const output = document.querySelector('#q23-output');

const cart = localStorage.getItem('q23-cart') || [];

function show() {
  output.textContent = cart.length === 0 ? 'Cart: (empty)' : `Cart: ${cart.join(', ')}`;
}

addButton.addEventListener('click', () => {
  cart.push('Coffee');
  localStorage.setItem('q23-cart', JSON.stringify(cart));
  show();
});

clearButton.addEventListener('click', () => {
  cart.length = 0;
  localStorage.removeItem('q23-cart');
  show();
});

show();

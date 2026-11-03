// Q12: add up the price of everything on the menu.
// It runs without an error, but the answer is wrong. Use a breakpoint to see why, then fix it.
const items = document.querySelectorAll('#menu .menu-item');
const output = document.querySelector('#q12-output');

let total = 0;

items.forEach((item) => {
  total = total + item.dataset.price;
});

output.textContent = `Whole menu costs $${total}`;

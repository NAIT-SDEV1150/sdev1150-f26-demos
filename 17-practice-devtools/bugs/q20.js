// Q20: click a quick-add button and the item is added to the list below.
// Sometimes it adds "undefined" instead. Find out when, and why, then fix it.
const cart = document.querySelector('#q20-cart');
const buttons = document.querySelectorAll('.add-btn');

buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const itemName = event.target.dataset.item;
    const line = document.createElement('li');
    line.textContent = `Added: ${itemName}`;
    cart.append(line);
  });
});

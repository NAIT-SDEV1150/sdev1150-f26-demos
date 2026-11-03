// Q11: list every menu item's name, separated by commas. Fix it.
const items = document.querySelectorAll('#menu .menu-item');
const output = document.querySelector('#q11-output');

const names = items.map((item) => item.dataset.name);
output.textContent = names.join(', ');

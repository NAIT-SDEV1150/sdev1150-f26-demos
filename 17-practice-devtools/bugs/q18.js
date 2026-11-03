// Q18: $20.00 with 15% off, then 5% tax, should be $17.85.
// Click "Check out": the answer is very wrong. Step through it to find out why, then fix it.
const button = document.querySelector('#q18-button');
const output = document.querySelector('#q18-output');

function applyDiscount(price, percent) {
  return price - price * percent;
}

function addTax(price) {
  return price * 1.05;
}

function checkout(price, discountPercent) {
  const discounted = applyDiscount(price, discountPercent);
  const final = addTax(discounted);
  return final;
}

button.addEventListener('click', () => {
  const final = checkout(20, 15); // 15% off
  output.textContent = `Final price: $${final.toFixed(2)}`;
});

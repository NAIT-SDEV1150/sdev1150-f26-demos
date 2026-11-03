// Q25: a $40 bill with a 15% tip should show "Tip: $6.00 · Total: $46.00".
// Click Calculate. Debug it properly (reproduce, read, locate, guess, test, fix, re-test),
// then write the short bug report described in QUESTIONS.md.
const billInput = document.querySelector('#q25-bill');
const tipSelect = document.querySelector('#q25-tip');
const button = document.querySelector('#q25-button');
const output = document.querySelector('#q25-output');

button.addEventListener('click', () => {
  const bill = billInput.value;
  const tipPercent = tipSelect.value;
  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;
  output.textContent = `Tip: $${tip.toFixed(2)} · Total: $${total.toFixed(2)}`;
});

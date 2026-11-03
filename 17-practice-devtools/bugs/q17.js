// Q17: the grand total says $NaN. One of the 200 orders is to blame.
// Don't hunt by reading: use a CONDITIONAL breakpoint to find which order it is, then fix it.
const output = document.querySelector('#q17-output');

// One character per order: how many items that order had.
// Order 1 is the first character, order 2 the second, and so on.
const quantities =
  '86531975429864318753297642186531975429864318753297' +
  '64218653197542986431875329764218653197542986431875' +
  '329764218653197542986431875329764218l5319754298643' +
  '18753297642186531975429864318753297642186531975429';

let grandTotal = 0;

for (let id = 1; id <= 200; id += 1) {
  const price = 2 + (id % 4); // every order costs $2 to $5 per item
  const quantity = Number(quantities[id - 1]);
  const lineTotal = price * quantity;
  grandTotal = grandTotal + lineTotal;
}

output.textContent = `Grand total for 200 orders: $${grandTotal.toFixed(2)}`;

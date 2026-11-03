// Q9: the Place order button should say "Order placed!". Fix it.
const orderButton = document.querySelector('#order-btn');
const orderOutput = document.querySelector('#q9-output');

orderButton.addEventListener('click', () => {
  orderOutput.textContent = 'Order placed!';
});

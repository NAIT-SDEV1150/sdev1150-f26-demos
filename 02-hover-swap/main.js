// Day 14, demo 2: two identical buttons that swap when the mouse touches them.
const btnA = document.querySelector('#btn-a');
const btnB = document.querySelector('#btn-b');
const area = document.querySelector('#play-area');
const message = document.querySelector('#message');

// Put a button at a random spot inside the play area
function moveToRandomSpot(button) {
  const maxLeft = area.clientWidth - 140;
  const maxTop = area.clientHeight - 50;
  button.style.left = `${Math.floor(Math.random() * maxLeft)}px`;
  button.style.top = `${Math.floor(Math.random() * maxTop)}px`;
  button.style.right = 'auto';
  button.style.bottom = 'auto';
}

// Hide one button and show the other
function swap(hideThis, showThis) {
  hideThis.classList.add('hidden');
  moveToRandomSpot(showThis);
  showThis.classList.remove('hidden');
}

// mouseenter fires once when the mouse moves onto the element
btnA.addEventListener('mouseenter', () => swap(btnA, btnB));
btnB.addEventListener('mouseenter', () => swap(btnB, btnA));

// If someone manages to click (for example with the keyboard: Tab, then Enter)
btnA.addEventListener('click', () => { message.textContent = 'You caught it!'; });
btnB.addEventListener('click', () => { message.textContent = 'You caught it!'; });

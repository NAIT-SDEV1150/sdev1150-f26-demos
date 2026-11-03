// site.js: the café's own code.
// Most questions only ask you to LOOK at what this file does with DevTools.
// Only Q24 asks you to change something here.

const menu = [
  { name: 'Coffee', price: 2.25, category: 'drink' },
  { name: 'Tea', price: 1.95, category: 'drink' },
  { name: 'Muffin', price: 3.25, category: 'food' },
  { name: 'Bagel', price: 2.75, category: 'food' },
  { name: 'Smoothie', price: 5.5, category: 'drink' },
  { name: 'Cookie', price: 1.5, category: 'food' },
];

// Put the menu on window on purpose, so you can use it in the Console (Q10).
window.cafeMenu = menu;

// Count visits in localStorage (Q14)
const visits = Number(localStorage.getItem('cafe-visits') ?? 0) + 1;
localStorage.setItem('cafe-visits', visits);
document.querySelector('#visit-count').textContent = `Visit #${visits}`;

// "Surprise me" button (Q16)
const surpriseButton = document.querySelector('#surprise-btn');
const surpriseOutput = document.querySelector('#surprise-output');

function pickSurprise() {
  const index = Math.floor(Math.random() * menu.length);
  surpriseOutput.textContent = `Try the ${menu[index].name}!`;
}

surpriseButton.addEventListener('click', pickSurprise);

// Today's specials come from a JSON file (Q13).
// (You'll learn fetch properly soon. For now, just watch it in the Network panel.)
async function loadSpecials() {
  const list = document.querySelector('#specials-list');
  const response = await fetch('data/specials.json');
  const specials = await response.json();
  list.replaceChildren();
  specials.forEach((special) => {
    const item = document.createElement('li');
    item.textContent = `${special.name}: $${special.price.toFixed(2)}`;
    list.append(item);
  });
}

// Opening hours also come from a JSON file (Q24).
async function loadHours() {
  const hoursSpan = document.querySelector('#hours');
  try {
    const response = await fetch('data/hours.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const hours = await response.json();
    hoursSpan.textContent = `${hours.open} to ${hours.close}`;
  } catch (error) {
    hoursSpan.textContent = 'Hours unavailable.';
    console.warn('Could not load the opening hours:', error.message);
  }
}

loadSpecials();
loadHours();

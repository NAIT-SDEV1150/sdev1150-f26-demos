// Day 14, demo 5: show and hide with a .hidden class (display: none).

// 1. A button that turns a panel on and off
const toggleBtn = document.querySelector('#toggle-btn');
const details = document.querySelector('#details');

toggleBtn.addEventListener('click', () => {
  details.classList.toggle('hidden');               // add it if missing, remove it if there
  const isHidden = details.classList.contains('hidden');
  toggleBtn.textContent = isHidden ? 'Show details' : 'Hide details';
});

// 2. Hover to peek: hide the cover while the mouse is over the card
const peek = document.querySelector('#peek');
const cover = peek.querySelector('.cover');

peek.addEventListener('mouseenter', () => cover.classList.add('hidden'));
peek.addEventListener('mouseleave', () => cover.classList.remove('hidden'));
// The listener is on the CARD, not the cover. If it were on the cover,
// hiding the cover would make the mouse "leave" it straight away.

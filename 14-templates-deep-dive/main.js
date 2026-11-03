// Demo 14: templates deep dive (SDEV1150, Day 19)
// Four panels, top to bottom:
//   1. A <template> is inert, and its .content fragment empties when you append it.
//   2. Why we don't build HTML from strings with innerHTML (XSS), and the safe way.
//   3. A contact list: an array is the state, one render() draws it, one listener
//      (event delegation with closest() and data-id) handles every button.
//   4. A sneak peek at <slot>, shadow DOM and custom elements.

// ---------------------------------------------------------------------------
// Panel 1: a template is inert
// ---------------------------------------------------------------------------
const helloTemplate = document.querySelector('#hello-template');
const stampArea = document.querySelector('#stamp-area');
const inspectLog = document.querySelector('#inspect-log');
let copyCount = 0;

document.querySelector('#btn-inspect').addEventListener('click', () => {
  const content = helloTemplate.content;
  const lines = [
    `template.content is a ${content.constructor.name}`,
    `elements inside it: ${content.children.length} (${[...content.children].map((el) => el.tagName).join(', ')})`,
    `document.querySelector('.hello') finds: ${document.querySelector('.hello') ? 'a copy on the page' : 'null (the template is not part of the page)'}`,
    `helloTemplate.content.querySelector('.hello') finds: ${content.querySelector('.hello') ? 'the <p> inside the template' : 'null'}`,
  ];
  inspectLog.textContent = lines.join('\n');
});

document.querySelector('#btn-stamp').addEventListener('click', () => {
  copyCount += 1;
  const fragment = helloTemplate.content.cloneNode(true); // a deep copy (a new DocumentFragment)

  // Fill it in BEFORE appending: the fragment still holds the elements.
  fragment.querySelector('.copy-number').textContent = copyCount;
  const before = fragment.children.length;

  stampArea.append(fragment); // the fragment's children MOVE onto the page

  const after = fragment.children.length;
  inspectLog.textContent = [
    `Copy ${copyCount}: cloned the template's content (deep copy).`,
    `Children in the fragment before append: ${before}`,
    `Children in the fragment after append:  ${after}  <- the box is empty now`,
    `fragment.querySelector('.copy-number') after append: ${fragment.querySelector('.copy-number')}`,
  ].join('\n');
});

document.querySelector('#btn-clear-stamps').addEventListener('click', () => {
  stampArea.replaceChildren(); // no arguments = remove every child
  copyCount = 0;
  inspectLog.textContent = 'Cleared. replaceChildren() with no arguments empties an element.';
});

// ---------------------------------------------------------------------------
// Panel 2: innerHTML vs template + textContent
// ---------------------------------------------------------------------------
const xssInput = document.querySelector('#xss-input');
const unsafeOut = document.querySelector('#unsafe-out');
const safeOut = document.querySelector('#safe-out');
const xssStatus = document.querySelector('#xss-status');
const greetingTemplate = document.querySelector('#greeting-template');

// The "name" a user typed. The onerror attribute is code. Here it only changes a
// status line, but real attack code could read the page or send data away.
xssInput.value = `Sam<img src="nope.png" onerror="document.querySelector('#xss-status').textContent='Injected code ran! It could have read or changed this page.'; document.querySelector('#xss-status').className='status bad'">`;

document.querySelector('#btn-unsafe').addEventListener('click', () => {
  // UNSAFE: the user's text is glued into an HTML string, so the browser parses it as HTML.
  unsafeOut.innerHTML = `<p class="greeting">Welcome, <b>${xssInput.value}</b>!</p>`;
});

document.querySelector('#btn-safe').addEventListener('click', () => {
  // SAFE: the HTML shape comes from the template; the user's text goes in with textContent.
  const fragment = greetingTemplate.content.cloneNode(true);
  fragment.querySelector('.greeting-name').textContent = xssInput.value; // shown as plain text
  safeOut.replaceChildren(fragment);
  if (!xssStatus.classList.contains('bad')) {
    xssStatus.textContent = 'textContent showed the text exactly as typed. No code ran.';
    xssStatus.className = 'status good';
  }
});

// ---------------------------------------------------------------------------
// Panel 3: contact list (state + render + delegation)
// ---------------------------------------------------------------------------
const contactTemplate = document.querySelector('#contact-template');
const contactList = document.querySelector('#contact-list');
const countLabel = document.querySelector('#count');
const emptyMessage = document.querySelector('#empty');
const searchInput = document.querySelector('#search');
const favOnly = document.querySelector('#fav-only');
const eventLog = document.querySelector('#event-log');
const stateView = document.querySelector('#state-view');

const starterContacts = [
  { id: 'c1', name: 'Avery Chen', email: 'avery@example.com', city: 'Calgary', avatar: 'images/avatar-1.svg', favourite: false },
  { id: 'c2', name: 'Jordan Blake', email: 'jordan@example.com', city: 'Edmonton', avatar: 'images/avatar-2.svg', favourite: true },
  { id: 'c3', name: 'Riley Singh', email: 'riley@example.com', city: 'Red Deer', avatar: 'images/avatar-3.svg', favourite: false },
  { id: 'c4', name: 'Morgan Dubois', email: 'morgan@example.com', city: 'Lethbridge', avatar: 'images/avatar-4.svg', favourite: false },
];

const samplePool = [
  { name: 'Casey Okafor', email: 'casey@example.com', city: 'Banff', avatar: 'images/avatar-5.svg' },
  { name: 'Taylor Nguyen', email: 'taylor@example.com', city: 'Canmore', avatar: 'images/avatar-1.svg' },
  { name: 'Quinn Martel', email: 'quinn@example.com', city: 'Medicine Hat', avatar: 'images/avatar-3.svg' },
];

// STATE: the array is the truth. The page is just a picture of it.
// structuredClone makes a fresh copy so "Reset data" can start over.
let contacts = structuredClone(starterContacts);
let nextId = 5;

// FACTORY: data in, element out. It does not touch the page.
function createContactItem(contact) {
  const fragment = contactTemplate.content.cloneNode(true);
  const item = fragment.querySelector('.contact'); // keep the real <li>, not the fragment

  item.dataset.id = contact.id; // becomes data-id="c1" in the HTML
  item.classList.toggle('is-favourite', contact.favourite);

  const avatar = item.querySelector('.avatar');
  avatar.src = contact.avatar;
  avatar.alt = `Avatar for ${contact.name}`;

  item.querySelector('.name').textContent = contact.name;

  const email = item.querySelector('.email');
  email.textContent = contact.email;
  email.href = `mailto:${contact.email}`;

  item.querySelector('.city').textContent = contact.city;

  const favButton = item.querySelector('.fav');
  favButton.querySelector('.icon').textContent = contact.favourite ? '★' : '☆';
  favButton.querySelector('.label').textContent = contact.favourite ? 'Favourited' : 'Favourite';
  favButton.setAttribute('aria-pressed', String(contact.favourite));

  return item; // an <li>, ready to append anywhere
}

// Which contacts should be visible right now? (The state itself is not changed.)
function visibleContacts() {
  const term = searchInput.value.trim().toLowerCase();
  return contacts.filter((contact) => {
    const matchesText = contact.name.toLowerCase().includes(term) || contact.city.toLowerCase().includes(term);
    const matchesFav = !favOnly.checked || contact.favourite;
    return matchesText && matchesFav;
  });
}

// RENDER: throw away the old picture, draw a new one from the state.
function render() {
  const shown = visibleContacts();
  contactList.replaceChildren(...shown.map(createContactItem));

  countLabel.textContent = `Showing ${shown.length} of ${contacts.length} contact${contacts.length === 1 ? '' : 's'}`;
  emptyMessage.hidden = shown.length > 0;
  stateView.textContent = JSON.stringify(contacts.map(({ id, name, favourite }) => ({ id, name, favourite })), null, 1);
}

// ONE listener for every button in the list, now and in the future (event delegation).
contactList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return; // the click was not on a button (or inside one)

  const item = button.closest('.contact');
  const id = item.dataset.id;
  const action = button.dataset.action;

  eventLog.textContent = [
    `event.target:                 <${event.target.tagName.toLowerCase()} class="${event.target.className}">`,
    `closest('button[data-action]'): data-action="${action}"`,
    `closest('.contact'):           data-id="${id}"`,
  ].join('\n');

  if (action === 'delete') {
    contacts = contacts.filter((contact) => contact.id !== id); // 1. change the state
  } else if (action === 'favourite') {
    const contact = contacts.find((c) => c.id === id);
    contact.favourite = !contact.favourite;                      // 1. change the state
  }
  render();                                                      // 2. redraw from the state
});

document.querySelector('#btn-add-sample').addEventListener('click', () => {
  const sample = samplePool[(nextId - 5) % samplePool.length];
  contacts.push({ ...sample, id: `c${nextId}`, favourite: false }); // change the state...
  nextId += 1;
  render();                                                        // ...then redraw
});

document.querySelector('#btn-reset').addEventListener('click', () => {
  contacts = structuredClone(starterContacts);
  nextId = 5;
  searchInput.value = '';
  favOnly.checked = false;
  eventLog.textContent = 'Data reset.';
  render();
});

searchInput.addEventListener('input', render);
favOnly.addEventListener('change', render);

render(); // first picture

// ---------------------------------------------------------------------------
// Panel 4: sneak peek at custom elements (we build these properly later in the term)
// ---------------------------------------------------------------------------
class ContactBadge extends HTMLElement {
  constructor() {
    super();
    const template = document.querySelector('#badge-template');
    const shadow = this.attachShadow({ mode: 'open' }); // a private DOM for this element
    shadow.append(template.content.cloneNode(true));     // same clone trick as above
  }
}
customElements.define('contact-badge', ContactBadge);

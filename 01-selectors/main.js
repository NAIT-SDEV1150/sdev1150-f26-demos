// Day 14, demo 1: querySelector and querySelectorAll.

// Step 1: find ONE element (the first match) by id, class or element
const title = document.querySelector('#page-title');   // id    → #
const intro = document.querySelector('.intro');        // class → .
const firstFruit = document.querySelector('li');       // element name

// Step 2: change that one element
title.textContent = 'Day 14: querySelector practice';
intro.style.color = 'teal';
firstFruit.classList.add('highlight');

// Step 3: find ALL matches (a NodeList)
const fruits = document.querySelectorAll('.fruit');
console.log(fruits.length);   // 4

// Step 4: change every match with forEach
fruits.forEach((li) => {
  li.textContent = li.textContent.toUpperCase();
});

// Step 5: add styles and content
document.querySelectorAll('#fruit-list .sale').forEach((li) => {
  li.style.color = 'crimson';
  li.textContent += ' (on sale)';
});

const kiwi = document.createElement('li');   // make
kiwi.textContent = 'KIWI';                    // fill
kiwi.classList.add('fruit');
document.querySelector('#fruit-list').append(kiwi);   // attach

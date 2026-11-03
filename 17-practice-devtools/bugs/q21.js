// Q21: "Leave a tip" does nothing, and there is no error. Fix it.
const tipButton = document.querySelector('#q21-button');
const tipOutput = document.querySelector('#q21-output');

tipButton.addEventListener('Click', () => {
  tipOutput.textContent = 'Thanks for the tip!';
});

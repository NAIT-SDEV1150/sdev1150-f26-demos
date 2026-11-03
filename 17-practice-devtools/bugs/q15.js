// Q15: nothing in this file runs at all. Read the Console message and fix it.
const output = document.querySelector('#q15-output');

function greet(hour) {
  if (hour < 12) {
    return 'Good morning!';
  } else if (hour < 18) {
    return 'Good afternoon!';
  } else {
    return 'Good evening!';
  }
  }
}

output.textContent = greet(new Date().getHours());

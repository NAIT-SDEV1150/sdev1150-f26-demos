// Day 14, demo 6: tic-tac-toe by showing and hiding letters that are already there.
const cells = document.querySelectorAll('.cell');
const status = document.querySelector('#status');
const resetBtn = document.querySelector('#reset-btn');

let turn = 'x';   // 'x' or 'o'

// A cell is taken if its X or its O is showing
function isTaken(cell) {
  return !cell.querySelector('.x').classList.contains('hidden')
      || !cell.querySelector('.o').classList.contains('hidden');
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    if (isTaken(cell)) return;                          // can't play on a used cell

    const iles= cell.querySelector(`.${turn}`)
    iles.classList.remove('hidden');   // show X or O

    turn = turn === 'x' ? 'o' : 'x';                   // switch players
    status.textContent = `${turn.toUpperCase()}'s turn`;
  });
});

// New game: hide every letter again
resetBtn.addEventListener('click', () => {
  document.querySelectorAll('.x, .o').forEach((letter) => {
    letter.classList.add('hidden');
  });
  turn = 'x';
  status.textContent = "X's turn";
});

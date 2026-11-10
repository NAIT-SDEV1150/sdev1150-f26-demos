// JSON playground: JSON.parse and JSON.stringify on whatever you type.
// (No fetch here on purpose: fetch is next class.)

const input = document.querySelector('#json-input');
const output = document.querySelector('#output');
const status = document.querySelector('#status');

const BROKEN_EXAMPLES = [
  "{ 'title': 'Dune' }",                       // single quotes
  '{ title: "Dune" }',                          // key without quotes
  '{ "title": "Dune", "year": 1965, }',         // trailing comma
  '{ "title": "Dune" // my favourite\n}',       // comment
  '{ "title": "Dune"',                          // missing closing brace
];
let brokenIndex = 0;

const showResult = (ok, message, text) => {
  status.textContent = message;
  status.classList.toggle('ok', ok);
  status.classList.toggle('error', !ok);
  output.textContent = text;
};

// Parse: text -> JavaScript value
const parse = () => {
  try {
    const value = JSON.parse(input.value);
    const kind = Array.isArray(value) ? 'an array' : value === null ? 'null' : `a ${typeof value}`;
    showResult(true, `Valid JSON. JSON.parse gave you ${kind}.`, `console.log(value) would show:\n${JSON.stringify(value)}`);
    return value;
  } catch (err) {
    showResult(false, `${err.name}: ${err.message}`, 'Not valid JSON. Read the message: it tells you what it found and where.');
    return undefined;
  }
};

// Pretty-print: parse, then turn back into text with 2-space indents
const prettyPrint = () => {
  const value = parse();
  if (value === undefined) return;
  input.value = JSON.stringify(value, null, 2);
  showResult(true, 'JSON.stringify(value, null, 2) re-formatted it.', input.value);
};

document.querySelector('#btn-parse').addEventListener('click', parse);
document.querySelector('#btn-pretty').addEventListener('click', prettyPrint);
document.querySelector('#btn-broken').addEventListener('click', () => {
  input.value = BROKEN_EXAMPLES[brokenIndex];
  brokenIndex = (brokenIndex + 1) % BROKEN_EXAMPLES.length;
  parse();
});

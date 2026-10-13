let selectedX = null;
let results = [];
const xButtons = document.querySelectorAll('[data-x]');
for (const button of xButtons) {
   button.addEventListener('click', function () {
           selectedX = Number(button.dataset.x);

           for (const otherButton of xButtons) {
               otherButton.classList.remove('selected');
           }

           button.classList.add('selected');
       });
}
let selectedR = null;
const rButtons = document.querySelectorAll('[data-r]');
for (const button of rButtons) {
  button.addEventListener('click', function () {
             selectedR = Number(button.dataset.r);

             for (const otherButton of rButtons) {
                 otherButton.classList.remove('selected');
             }

             button.classList.add('selected');
         });
}
const form = document.querySelector('form');
const yInput = document.querySelector('#y');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (selectedX === null || selectedR === null) {
        alert("Выбери X и R");
        return;
    }
    const rawY = yInput.value.trim();
    const y = Number(rawY);
    if ((rawY === "") || (!Number.isFinite(y)) || (y <= -5) || (y >= 5)) {
        alert("Y должен быть больше -5 и меньше 5");
        yInput.focus();
        return;
    }
    const hit = isHit(selectedX, y, selectedR);
    const timestamp = Date.now();
    const result = {
        x: selectedX,
        y: y,
        r: selectedR,
        hit: hit,
        timestamp: timestamp,
    };
    results.push(result);
    localStorage.setItem('lab1-results', JSON.stringify(results));
    addResultRow(selectedX, y, selectedR, hit, timestamp);
    console.log(selectedX, y, selectedR, hit);
});
function isHit(x, y, r) {
    const inTriangle = ((x >= 0) && (y >= 0) && ((x+y) <= r));
    const inRectangle = (((-r <= x) && (x <= 0)) && ((-r/2 <= y) && (y <= 0)));
    const inCircle = ((x >= 0) && (y <= 0) && ((x*x + y*y) <= ((r/2)*(r/2))));
    return inTriangle || inRectangle || inCircle;
}
const resultsBody = document.querySelector('#results-body');
const savedResults = localStorage.getItem('lab1-results');
if (savedResults !== null) {
    try {
       const parsedResults = JSON.parse(savedResults);
       if (Array.isArray(parsedResults)) {
           results = parsedResults;
           for (const result of results) {
               addResultRow(result.x, result.y, result.r, result.hit, result.timestamp);
           }
       }
    }
    catch (error) {
       console.error('Не удалось восстановить историю', error);
    }
}
function addResultRow(x, y, r, hit, timestamp) {
    const row = document.createElement('tr');
    const values = new Array(x, y, r, (hit ? 'Попадание' : 'Промах'), new Date(timestamp).toLocaleString('ru-RU'));
    for (const value of values) {
       const cell = document.createElement('td');
       cell.textContent = value;
       row.append(cell);
    }
    resultsBody.prepend(row);
}
let selectedX = null;
let results = [];
const STORAGE_KEY = 'lab1-results-12686-v3'
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
    if ((!Number.isInteger(selectedX)) || (!Number.isInteger(selectedR)) || (selectedX < -4) || (selectedX > 4) || (selectedR < 1) || (selectedR > 5)) {
        alert("Выбери допустимые X и R");
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
    drawPlot();
    drawPoint(selectedX, y, selectedR, hit);
    const timestamp = Date.now();
    const result = {
        x: selectedX,
        y: y,
        r: selectedR,
        hit: hit,
        timestamp: timestamp,
    };
    results.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
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
const savedResults = localStorage.getItem(STORAGE_KEY);
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
const canvas = document.querySelector("#plot");
const ctx = canvas.getContext("2d");
function drawPlot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(200, 60);
    ctx.lineTo(340, 200);
    ctx.closePath();
    ctx.fillStyle = '#3399ff';
    ctx.fill();
    ctx.fillRect(60, 200, 140, 70);
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 70, 0, Math.PI/2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(20, 200);
    ctx.lineTo(380, 200);
    ctx.moveTo(200, 380);
    ctx.lineTo(200, 20);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    ctx.moveTo(372, 195);
    ctx.lineTo(380, 200);
    ctx.lineTo(372, 205);
    ctx.moveTo(195, 28);
    ctx.lineTo(200, 20);
    ctx.lineTo(205, 28);
    for (const x of [60, 130, 270, 340]) {
        ctx.moveTo(x, 196);
        ctx.lineTo(x, 204);
    }
    for (const y of [60, 130, 270, 340]) {
        ctx.moveTo(196, y);
        ctx.lineTo(204, y);
    }
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText("-R", 50, 190);
    ctx.fillText("-R/2", 110, 190);
    ctx.fillText("R/2", 260, 190);
    ctx.fillText("R", 335, 190);
    ctx.fillText("R", 210, 65);
    ctx.fillText("R/2", 210, 135);
    ctx.fillText("-R/2", 210, 275);
    ctx.fillText("-R", 210, 345);
    ctx.fillText("X", 380, 190);
    ctx.fillText("Y", 210, 20);
}
function drawPoint(x, y, r, hit) {
    const scale = 140 / r;
    const pixelX = 200 + x * scale;
    const pixelY = 200 - y * scale;
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = hit ? 'green' : 'red';
    ctx.fill();
}
drawPlot();
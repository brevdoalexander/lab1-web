let selectedX = null;
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
    const y = Number(rawY)
    if ((rawY === "") || (!Number.isFinite(y)) || (y <= -5) || (y >= 5)) {
        alert("Y должен быть больше -5 и меньше 5");
        yInput.focus();
        return;
    }
    console.log(selectedX, y, selectedR);
});
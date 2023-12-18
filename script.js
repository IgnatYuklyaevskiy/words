const btn = document.querySelector('.button');
const input = document.querySelector('.words_input');
const topWords = document.querySelector('.topWords');
const dragDrop = document.querySelector('.dragDrop');
const output = document.querySelector('.output');

let currentWords = {};
let a = 1;
let n = 1;

function clearArea() {
    currentWords = {}; 

    a = 1;
    n = 1;

    topWords.innerHTML = '';
    dragDrop.innerHTML = '';
    output.textContent = '';
}

function onSubmit() {
    clearArea();
    let str = input.value.split("-").map(w => w.trim()).filter(w => w !== '');

    let numbers = [];
    
    str.forEach(s => {
        if(!isNaN(+s)) {
            numbers.push(+s);
        }
    });

    numbers = numbers.sort((a, b) => a - b);

    let strings = [];

    str.forEach(s => {
        if(isNaN(+s)) {
            strings.push(s);
        }
    });

    strings = strings.sort((a, b) => a.localeCompare(b));

    let associativeArray = {};

    for (let i = 0; i < strings.length; i++) {
        let key = "a" + (i + 1);
        associativeArray[key] = strings[i];
    }

    for (let i = 0; i < numbers.length; i++) {
        let key = "n" + (i + 1);
        associativeArray[key] = numbers[i];
    }
    
    displayWords(associativeArray);
}

btn.addEventListener('click', onSubmit)


function onTopWordDrag(event) {
    console.log('moveTop', event)
        const word = event.target;

        let shiftX = event.clientX - word.getBoundingClientRect().left;
        let shiftY = event.clientY - word.getBoundingClientRect().top;
      
        word.style.position = 'absolute';
        word.style.zIndex = 1000;
        // document.body.append(word);
      
        moveAt(event.pageX, event.pageY);
      
        // переносит мяч на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
          word.style.left = pageX - shiftX + 'px';
          word.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) { 
            moveAt(event.pageX, event.pageY);
        }
      
        // передвигаем мяч при событии mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // отпустить мяч, удалить ненужные обработчики
        word.onmouseup = function(event) {
          document.removeEventListener('mousemove', onMouseMove);

            console.log('up');
          word.onmouseup = null;

          word.hidden = true;
          let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            console.log(elemBelow.closest('.dragDrop'))
            console.log(elemBelow.closest('.topWords'))

          word.hidden = false;


          if(elemBelow.closest('.dragDrop') === dragDrop) {
            appendWordToDragDrop(word.textContent);
            word.remove();
          }

          if(elemBelow.closest('.topWords') === topWords) {
              moveAt(event.pageX, event.pageY);
          }
 
          word.style.position = '';
          word.style.zIndex = '';
        };
      
      
     
}

function appendWordToDragDrop(text) {
    const word = text.split(" ").slice(1).join(" ");
    let p = document.createElement('p');
    p.classList.add('wordDrag');
    p.textContent = word;

    p.onmousedown = onWordDrag;
    p.ondragstart = function() {
       return false;
     };

    dragDrop.appendChild(p);



    checkWordsOrder();
}
 

function checkWordsOrder() {
    const elements = document.querySelectorAll('.wordDrag');

    const n = [...elements].sort(el => el.clientX);

    output.textContent = n.map(el => el.textContent).join(' ');
}

function onWordDrag(event) {
    console.log('move', event)
        const word = event.target;

        let shiftX = event.clientX - word.getBoundingClientRect().left;
        let shiftY = event.clientY - word.getBoundingClientRect().top;
      
        word.style.position = 'absolute';
        word.style.zIndex = 1000;
        document.body.append(word);
      
        moveAt(event.pageX, event.pageY);
      
        // переносит мяч на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
          word.style.left = pageX - shiftX + 'px';
          word.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {

            word.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY).closest('.dragDrop');
            word.hidden = false;


            if(elemBelow != dragDrop) {
                return;
            }

          moveAt(event.pageX, event.pageY);
        }
      
        // передвигаем мяч при событии mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // отпустить мяч, удалить ненужные обработчики
        word.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          word.onmouseup = null;
          checkWordsOrder();
        };
      
      
     
}

function displayWords(obj) {

    let keys = Object.keys(obj);
    currentWords = obj;

    for(let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = obj[key];

        let p = document.createElement('p');
        p.classList.add('wordTop');
        p.textContent = `${key} ${value}`;

        p.onmousedown = onTopWordDrag;
        p.ondragstart = function() {
           return false;
         };

        topWords.appendChild(p);
    }

}
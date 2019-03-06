// import { Droppable }  from 'https://cdn.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.8/lib/draggable.bundle.min.js';
'use strict';
console.log('reading js');
//
// const droppable = new Droppable(document.querySelectorAll('section .inner'), {
//   draggable: '.tile',
//   dropzone: '.box',
//   mirror: {
//     constrainDimensions: true,
//   }
// });

var acc = document.querySelectorAll('.accordion');
var but = document.querySelectorAll('.mode button');
var inner = document.querySelector('.inner');
var viewRect = document.querySelector('.view').getBoundingClientRect();
var boxRect = document.querySelector('.box').getBoundingClientRect();
var cols = inner.childElementCount * boxRect.width;
var rows = document.querySelector('.row').childElementCount * boxRect.height;
var initialX, initialY;
var offsetX = 0,
  offsetY = 0;
var dragged, tiles = [],
  curTile = '';

console.log('cols: ' + cols);
console.log('rows: ' + rows);

document.addEventListener('load', function() {
  document.addEventListener('dragstart', startDrag);
  document.addEventListener('dragover', overDrag);
  document.addEventListener('dragenter', enterDrag);
  document.addEventListener('dragleave', leaveDrag);
  document.addEventListener('drop', drop);
});

//ACCORDION MENU
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function() {
    var icon = this.firstChild;
    var panel = this.nextElementSibling;
    // console.log(icon);
    if (panel.style.display === 'flex') {
      panel.style.display = 'none';
      icon.className = 'fas fa-caret-right';
      this.style.borderBottom = '2px solid #cedad9';
    } else {
      panel.style.display = 'flex';
      icon.className = 'fas fa-caret-down';
      this.style.border = 'none';
      // console.log(icon);
    }
  })
}
//MODE BUTTONS
but[0].addEventListener('click', function() { //mouse -drag
  if (this.id != 'active') {
    this.id = 'active';
    but[1].id = '';
    //remove pan event
    inner.removeEventListener('mousedown', startPan);
    inner.removeEventListener('mouseup', endPan);
    //add drag events
    document.addEventListener('dragstart', startDrag);
    document.addEventListener('dragover', overDrag);
    document.addEventListener('dragenter', enterDrag);
    document.addEventListener('dragleave', leaveDrag);
    document.addEventListener('drop', drop);
    document.addEventListener('click', delesectTile);
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener('click', selectTile);
    }
  }
});

but[1].addEventListener('click', function() { //pan
  if (this.id != 'active') {
    this.id = 'active';
    but[0].id = '';
    //remove drag events
    document.removeEventListener('dragstart', startDrag);
    document.removeEventListener('dragover', overDrag);
    document.removeEventListener('dragenter', enterDrag);
    document.removeEventListener('dragleave', leaveDrag);
    document.removeEventListener('drop', drop);
    document.removeEventListener('click', delesectTile);
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].removeEventListener('click', selectTile);
    }
    //add pan event
    inner.addEventListener('mousedown', startPan);
    inner.addEventListener('mouseup', endPan);
  }
});
//CLICK MODE
function startDrag(event) {
  console.log('startdrag');
  dragged = event.target;
}

function overDrag(event) {
  event.preventDefault();
}

function enterDrag(event) {
  console.log('enterDrag');
  if (event.target.className == 'box') {
    event.target.style.border = '2px solid #ccc';
  }
}

function leaveDrag(event) {
  console.log('leaveDrag');
  if (event.target.className == 'box') {
    event.target.style.border = '';
  }
}

function drop(event) {
  console.log('drop');
  event.preventDefault();

  if (event.target.className = 'box') {
    event.target.style.border = '';
    var img = dragged.cloneNode();
    img.setAttribute('draggable', false);
    tiles.push(img);
    img.addEventListener('click', selectTile);
    event.target.appendChild(img);
  }
}

function selectTile() {
  if (curTile !== event.target) {
    curTile = event.target;
    var icon = document.createElement('i');
    icon.className = 'fas fa-undo fa-rotate-270';
    event.target.parentElement.appendChild(icon);
    icon.addEventListener('click', rotate);
  }
  event.stopPropagation(); //prevent calling cancel event
}

function delesectTile() {
  console.log('deselecting');
  if (curTile !== '' && curTile !== event.target) {
    curTile.parentElement.removeChild(curTile.nextSibling);
    curTile = '';
  }
}

function rotate() {
  console.log('rotate');
}
//PAN MODE
function startPan(event) {
  console.log('startPan');
  initialX = event.clientX;
  initialY = event.clientY;
  offsetX = parseInt(this.style.left, 10);
  offsetY = parseInt(this.style.top, 10);

  if (isNaN(offsetX) || isNaN(offsetY)) {
    offsetX = 0;
    offsetY = 0;
  }

  console.log('X: ' + offsetX);
  console.log('Y: ' + offsetY);
  inner.addEventListener('mousemove', pan);
}

function pan(event) {
  console.log('pan');
  var x = (event.clientX - initialX + offsetX);
  var y = (event.clientY - initialY + offsetY);
  if (x <= 0 && x >= (viewRect.width - cols)) {
    this.style.left = x + 'px';
  }
  if (y <= 0 && y >= (viewRect.height - rows)) {
    this.style.top = y + 'px';
  }
}

function endPan() {
  console.log('endPan');
  inner.removeEventListener('mousemove', pan);
}
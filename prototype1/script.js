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
var view = document.querySelector('.view');
var boxRect = document.querySelector('.box').getBoundingClientRect();
var cols = inner.childElementCount * boxRect.width;
var rows = document.querySelector('.row').childElementCount * boxRect.height;
var initialX, initialY;
var offsetX = 0,
  offsetY = 0;
var dragged, tiles = [],
  curTile = '';
var rotateAmt = 1;
var storage = window.localStorage;

console.log('cols: ' + cols);
console.log('rows: ' + rows);

document.addEventListener('dragstart', startDrag);
document.addEventListener('dragover', overDrag);
document.addEventListener('dragenter', enterDrag);
document.addEventListener('dragleave', leaveDrag);
document.addEventListener('drop', drop);
document.addEventListener('click', delesectTile);

document.querySelector('#reset').addEventListener('click', function() {
  console.log('clearing storage');
  storage.clear();
  location.reload();
});
// window.addEventListener('resize', function() {
//   viewRect = document.querySelector('.view').getBoundingClientRect();
// });

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
    delesectTile();
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
//drag and drop
function startDrag(event) {
  console.log('startdrag');
  dragged = event.target;
  delesectTile();
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
  console.log(event.target);
  console.log(event.target.nodeName);
  var tile;

  if (event.target.className == 'box') {
    event.target.style.border = '';
    tile = getTile();
    event.target.appendChild(tile);
    if (dragged.parentNode.className == 'box') {
      curTile = dragged;
      deleteTile();
    }
    storage.setItem(event.target.id, tile.id);
  } else if (event.target.nodeName == 'IMG') {
    var targetType = event.target.className;
    var dropType = dragged.className;
    var parent = event.target.parentNode;
    var count = parent.childElementCount;
    console.log('target: ' + targetType);
    console.log('item: ' + dropType);
    tile = getTile();
    if (dragged.parentNode.className == 'box') {
      curTile = dragged;
      deleteTile();
    }

    if (dropType == 'replace' && targetType == 'replace') {
      parent.appendChild(tile);
      parent.removeChild(event.target);
      storage.setItem(parent.id, tile.id);
    } else if (dropType == 'replace') { //targetType = layer
      var noReplace = true;
      var store = '';
      for (var i = 0; i < parent.children.length; i++) {
        if (parent.children[i].className == 'replace') {
          tile.style.top = parent.children[i].style.top;
          parent.replaceChild(tile, parent.children[i]);
          noReplace = false;
          store += ',' + tile.id;
        } else {
          store += ',' + parent.children[i].id;
        }
      }
      if (noReplace) {
        tile.style.top = (-100 * count) + 'px';
        parent.appendChild(tile);
        store += ',' + tile.id;
      }
      storage.setItem(parent.id, store);
    } else { //dropType = layer
      tile.style.top = (-100 * count) + 'px';
      parent.appendChild(tile);
      storage.setItem(parent.id, storage.getItem(parent.id) + ',' + tile.id);
    }
  }
}

function getTile() {
  var tile = dragged.cloneNode();
  tile.style.top = 0;
  tile.style.left = 0;
  tile.setAttribute('draggable', false);
  tiles.push(tile); //used to add event listeners later
  tile.addEventListener('click', selectTile);
  return tile;
}
//select tiles
function selectTile() {
  if (curTile !== event.target) {
    delesectTile();
    curTile = event.target;
    parent = event.target.parentNode;
    curTile.setAttribute('draggable', true);
    //delete
    var xIcon = document.createElement('i');
    xIcon.className = 'fas fa-times';
    xIcon.style.top = (parent.offsetTop) + 'px';
    xIcon.style.left = (parent.offsetLeft + 100) + 'px';

    parent.insertAdjacentElement('afterbegin', xIcon);
    xIcon.addEventListener('click', deleteTile);
    //rotate
    var rIcon = document.createElement('i');
    rIcon.className = 'fas fa-undo fa-rotate-270 fa-sm';
    rIcon.style.top = (parent.offsetTop + xIcon.offsetHeight) + 'px';
    rIcon.style.left = (parent.offsetLeft + 100) + 'px';
    parent.insertAdjacentElement('afterbegin', rIcon);
    rIcon.addEventListener('click', rotate);
  }
  event.stopPropagation(); //prevent calling cancel event
}

function delesectTile() {
  // console.log('deselecting');
  if (curTile !== '' && curTile !== event.target) {
    curTile.parentNode.removeChild(curTile.parentNode.children[0]); //remove rotate
    curTile.parentNode.removeChild(curTile.parentNode.children[0]); //remove delete
    curTile.setAttribute('draggable', false);
    curTile = '';
    rotateAmt = 1; //reset for next rotate
  }
}

function rotate(event) {
  console.log('rotate');
  // console.log(curTile);
  console.log(rotateAmt * 90);
  curTile.style.transform = 'rotate(' + (rotateAmt * 90) + 'deg)';

  rotateAmt++;
  if (rotateAmt > 3) {
    rotateAmt = 0;
  }
  event.stopPropagation();
}

function deleteTile(event) {
  var parent = curTile.parentNode;
  parent.removeChild(parent.children[0]); //remove rotate
  parent.removeChild(parent.children[0]); //remove delete
  rotateAmt = 1;
  parent.removeChild(curTile);
  curTile = '';
  //NEED TP UPDATE localStorage
  for (var i = 0; i < parent.children.length; i++) {
    parent.children[i].style.top = (-100 * i) + 'px';
  } //fix offset
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
  if (x <= 0 && x >= (view.clientWidth - cols)) {
    this.style.left = x + 'px';
  }
  if (y <= 0 && y >= (view.clientHeight - rows)) {
    this.style.top = y + 'px';
  }
}

function endPan() {
  console.log('endPan');
  inner.removeEventListener('mousemove', pan);
}
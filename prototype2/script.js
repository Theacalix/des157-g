'use strict';
console.log('reading js');
import * as m from '/des157-g/prototype2/modulefunc.js';
const acc = document.querySelectorAll('.accordion');
const but = document.querySelectorAll('.mode button');
const inner = document.querySelector('.inner');
// var initialX, initialY;
// var offsetX = 0,
//   offsetY = 0;
var dragged,
  curTile = '',
  storeTile;
var rotateAmt = 0;
const storage = window.localStorage;

window.addEventListener('load', function() {
  m.getLocal();
  console.log(m.tiles);
  clickTiles();
});
document.addEventListener('dragstart', startDrag);
document.addEventListener('dragover', overDrag);
document.addEventListener('dragenter', enterDrag);
document.addEventListener('dragleave', leaveDrag);
document.addEventListener('drop', drop);
document.addEventListener('click', delesectTile);
//Reset and Display Buttons
document.querySelector('#reset').addEventListener('click', function() {
  console.log('clearing storage');
  storage.clear();
  location.reload();
});

document.querySelector('#display').addEventListener('click', function() {
  window.open('display.html', '_blank');
});

//ACCORDION MENU
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function() {
    var icon = this.firstChild;
    var panel = this.nextElementSibling;
    if (panel.style.display === 'flex') {
      panel.style.display = 'none';
      icon.className = 'fas fa-caret-right';
      this.style.borderBottom = '2px solid #cedad9';
    } else {
      panel.style.display = 'flex';
      icon.className = 'fas fa-caret-down';
      this.style.border = 'none';
    }
  })
}
//MODE BUTTONS
but[0].addEventListener('click', function() { //mouse -drag
  if (this.id != 'active') {
    this.id = 'active';
    but[1].id = '';
    //remove pan event
    inner.removeEventListener('mousedown', m.startPan);
    inner.removeEventListener('mouseup', m.endPan);
    //add drag events
    document.addEventListener('dragstart', startDrag);
    document.addEventListener('dragover', overDrag);
    document.addEventListener('dragenter', enterDrag);
    document.addEventListener('dragleave', leaveDrag);
    document.addEventListener('drop', drop);
    document.addEventListener('click', delesectTile);
    clickTiles();
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
    for (var i = 0; i < m.length; i++) {
      m.tiles[i].removeEventListener('click', selectTile);
    }
    //add pan event
    inner.addEventListener('mousedown', m.startPan);
    inner.addEventListener('mouseup', m.endPan);
  }
});

function clickTiles() {
  for (var i = 0; i < m.tiles.length; i++) {
    m.tiles[i].addEventListener('click', selectTile);
  }
}
//CLICK MODE
//drag and drop
function startDrag(event) {
  console.log('startdrag');
  dragged = event.target;
  if (dragged.parentNode.className == 'box') {
    var index = Array.from(dragged.parentNode.children).indexOf(dragged) - 2; //for selected icons
    storeTile = m.getItems(dragged)[index];
    console.log(storeTile);
  } else {
    storeTile = dragged.id;
  }
  delesectTile();
}

function overDrag(event) {
  event.preventDefault();
}

function enterDrag(event) {
  // console.log('enterDrag');
  if (event.target.className == 'box') {
    event.target.style.border = '2px solid #ccc';
  }
}

function leaveDrag(event) {
  // console.log('leaveDrag');
  if (event.target.className == 'box') {
    event.target.style.border = '';
  }
}

function drop(event) {
  console.log('drop');
  event.preventDefault();
  console.log(storeTile);
  var tile;
  if (event.target.className == 'box' || event.target.nodeName == 'IMG') { //we are going to drop sucessfully
    if (dragged.parentNode.className == 'box') { //we can delete tile
      curTile = dragged;
      console.log('node to delete/clone ' + curTile);
      console.log('parent: ' + curTile.parentNode);
      deleteTile();
    }
    if (event.target.className == 'box') { //dragging into empty square
      event.target.style.border = '';
      tile = m.getTile(dragged);
      tile.addEventListener('click', selectTile);
      event.target.appendChild(tile);
      storage.setItem(event.target.id, storeTile);
      console.log(event.target.id + ',' + storeTile);
    } else if (event.target.nodeName == 'IMG') { //dragging on top of image
      var targetType = event.target.className;
      var dropType = dragged.className;
      var parent = event.target.parentNode;
      var count = parent.childElementCount;
      tile = m.getTile(dragged);
      tile.addEventListener('click', selectTile);
      if (dropType == 'replace' && targetType == 'replace') { //replace tile
        parent.appendChild(tile);
        parent.removeChild(event.target);
        storage.setItem(parent.id, storeTile);
      } else if (dropType == 'replace') { //targetType = layer
        var noReplace = true;
        var store = '';
        var items = storage.getItem(parent.id);
        items = items.split(',');
        for (var i = 0; i < parent.children.length; i++) { //check if replace tile exists and replace it
          if (parent.children[i].className == 'replace') {
            tile.style.top = parent.children[i].style.top;
            parent.replaceChild(tile, parent.children[i]);
            noReplace = false;
            if (i == 0) {
              store = storeTile;
            } else {
              store += ',' + storeTile;
            }
          } else {
            if (i == 0) {
              store = items[i];
            } else {
              store += ',' + items[i];
            }
          }
        }
        if (noReplace) { //if not append tile
          tile.style.top = (-100 * count) + 'px';
          parent.appendChild(tile);
          store += ',' + storeTile;
        }
        storage.setItem(parent.id, store);
      } else { //dropType = layer we don't care whats already there
        tile.style.top = (-100 * count) + 'px';
        parent.appendChild(tile);
        // console.log(storeTile);
        storage.setItem(parent.id, storage.getItem(parent.id) + ',' + storeTile);
      }
      console.log('Storing: ' + parent.id + ',' + storage.getItem(parent.id));
    }
  }
}

//select tile interactions
function selectTile() {
  if (curTile !== event.target) {
    delesectTile();
    curTile = event.target;
    parent = event.target.parentNode;
    curTile.setAttribute('draggable', true);
    var index = Array.from(curTile.parentNode.children).indexOf(curTile);
    var item = m.getItems(curTile)[index].split(';');
    if (rotateAmt = item[1]) {} else {
      rotateAmt = 0;
    }
    //add delete icon
    var xIcon = document.createElement('i');
    xIcon.className = 'fas fa-times';
    xIcon.style.top = (parent.offsetTop) + 'px';
    xIcon.style.left = (parent.offsetLeft + 100) + 'px';

    parent.insertAdjacentElement('afterbegin', xIcon);
    xIcon.addEventListener('click', deleteTile);
    //add rotate icon
    var rIcon = document.createElement('i');
    rIcon.className = 'fas fa-undo fa-rotate-270 fa-sm';
    rIcon.style.top = (parent.offsetTop + xIcon.offsetHeight) + 'px';
    rIcon.style.left = (parent.offsetLeft + 100) + 'px';
    parent.insertAdjacentElement('afterbegin', rIcon);
    rIcon.addEventListener('click', function(event) {
      rotateAmt = m.rotate(rotateAmt, curTile);
      event.stopPropagation();
    });
  }
  event.stopPropagation(); //prevent calling cancel event
}

function delesectTile() {
  // console.log('deselecting');
  if (curTile !== '' && curTile !== event.target) {
    curTile.parentNode.removeChild(curTile.parentNode.children[0]); //remove rotate
    curTile.parentNode.removeChild(curTile.parentNode.children[0]); //remove delete
    curTile.setAttribute('draggable', false);
    //save rotate
    var index = Array.from(curTile.parentNode.children).indexOf(curTile);
    var store = '';
    var items = m.getItems(curTile);
    items.splice(index, 1, curTile.id + ';' + rotateAmt); //replace with rotate
    store = items[0];
    for (var i = 1; i < items.length; i++) {
      store += ',' + items[i];
    }
    storage.setItem(parent.id, store);

    curTile = '';
    rotateAmt = 0; //reset for next rotate
  }
}

function deleteTile() {
  var parent = curTile.parentNode;
  parent.removeChild(parent.children[0]); //remove rotate
  parent.removeChild(parent.children[0]); //remove delete
  var index = Array.from(parent.children).indexOf(curTile);
  console.log('node to delete/clone ' + curTile);
  console.log('parent: ' + curTile.parentNode);
  var items = m.getItems(curTile);
  parent.removeChild(curTile);
  rotateAmt = 0;
  curTile = '';

  if (parent.children.length != 0) { //if still children update position and storage
    for (var i = 0; i < parent.children.length; i++) {
      parent.children[i].style.top = (-100 * i) + 'px';
    } //fix offset
    var store = '';
    items.splice(index, 1); //remove item to delete
    store = items[0];
    for (var i = 1; i < items.length; i++) {
      store += ',' + items[i];
    }
    console.log(store);
    storage.setItem(parent.id, store);
  } else { //no children remove storage
    storage.removeItem(parent.id);
  }
}
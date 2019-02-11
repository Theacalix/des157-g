'use strict';
console.log('reading js');

var dragged;
var images = ['charger.svg', 'headphones.svg', 'keys.svg', 'laptop.svg', 'lunch.svg', 'mouse.svg', 'notebook.svg', 'pencilcase.svg', 'phone.svg', 'sketchbook.svg', 'umbrella.svg', 'waterbottle.svg'];
var img;
var idx;

var backpack = document.querySelector('#draggable');
var initialX,
  initialY;
var offsetX = 0,
  offsetY = 0;
var lastActive = document.createElement('div');
var curDiv = document.createElement('div');

/*DRAG AND DROP -- DESKTOP*/
function getImg() {
  var newImg;
  img = new Image();
  //get image from array
  idx =  Math.floor(Math.random() * images.length);
  //console.log('num: ' + idx);
  newImg = images.slice(idx, idx + 1)[0];
  img.src = 'images/' + newImg;
  img.alt = setAlt(newImg);
  img.className = 'active';

  const dropRect = document.querySelector('.dropzone').getBoundingClientRect();
  img.style.width = dropRect.width + 'px';
  img.style.height = dropRect.height + 'px';

  document.body.insertBefore(img, document.querySelector('header'));
  //console.log('setting new image to: ' + newImg);
  //console.log('images length: ' + images.length);
}

function setAlt(name) {
  var pos = name.indexOf('.');
  //console.log(name.slice(0, pos));
  return name.slice(0, pos);
}

function initalPos() {
  img.style.left = initialX + 'px';
  img.style.top = initialY + 'px';
}

function changePos(curX, curY) {
  offsetX = curX - initialX;
  offsetY = curY - initialY;
  img.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';
  console.log(offsetX + ', ' + offsetY);
  console.log('transform: ' + img.style.transform);
}

document.addEventListener("dragstart", function(event) {
  // store a ref. on the dragged elem
  console.log('inside dragstart');
  dragged = event.target;
  event.dataTransfer.setData('text/plain', null);
  getImg();
  initialX = event.pageX;
  initialY = event.pageY;
  initalPos();
  //img.className = 'hidden';
  //console.log('img: ' + img + img.src);
  event.dataTransfer.setDragImage(img, 0, 0); //set to nothing
}, false);

document.addEventListener('dragend', function(event) {
  console.log('inside dragend');

  if(images.length == 0) {
    //console.log('images is empty');
    dragged.draggable = 'false';
  }
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function(event) {
  // prevent default to allow drop
  console.log('inside dragover');
  changePos(event.pageX, event.pageY);
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function(event) {
  // highlight potential drop target when the draggable element enters it
  console.log('inside dragenter');
  if (event.target.className == "dropzone") {
    event.target.style.background = "#E6E7E8";
  }

}, false);

document.addEventListener("dragleave", function(event) {
  console.log('inside dragleave');
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className == "dropzone") {
    event.target.style.background = "";
  }

}, false);

document.addEventListener("drop", function(event) {
  // prevent default action (open as link for some elements)
  console.log('inside drop');
  event.preventDefault();
  // move dragged elem to the selected drop target
  if (event.target.className == "dropzone") {
    event.target.style.background = '';
    //dragged.parentNode.removeChild( dragged );
    // var nodeCopy = dragged.cloneNode(true);
    // nodeCopy.id = '';
    // nodeCopy.src = 'images/' + newImg;
    img.className = '';
    img.removeAttribute('style');
    event.target.appendChild(img);
    images.splice(idx, 1); //remove img from array
    //console.log('images length: ' + images.length);
  }
  else {
    document.body.removeChild(img);
  }

}, false);

/*TOUCH DRAG AND DROP -- MOBILE*/

backpack.addEventListener('touchstart', function(event) {
  //console.log('running touch start');
  getImg();
  initialX = event.touches[0].pageX;
  initialY = event.touches[0].pageY;
  initalPos();
  //console.log('left: ' + event.touches[0].pageX + ' top: ' + event.touches[0].pageY);
});

backpack.addEventListener('touchmove', function(event) {
  //console.log('running touch move');
  //changePos(event.touches[0].pageX, event.touches[0].pageY);
  var curX = event.touches[0].pageX;
  var curY = event.touches[0].pageY;
  changePos(curX, curY);
  curDiv = document.elementFromPoint(curX, curY);
  if (curDiv != lastActive) {
    if (curDiv.classList.contains('dropzone')) {
      curDiv.style.background = "#E6E7E8";
    }
    lastActive.style.background = '';
    lastActive = curDiv;
  }
  //console.log(curDiv);
});

backpack.addEventListener('touchend', function(event) {
  //console.log('running touch end');
  if(curDiv.classList.contains('dropzone')) {
    curDiv.style.background = '';
    img.className = ''; //remove active
    img.removeAttribute('style');
    curDiv.appendChild(img);
    images.splice(idx, 1); //remove from array
  }
  else {
    document.body.removeChild(img);
  }

});

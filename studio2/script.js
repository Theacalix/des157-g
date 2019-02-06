var dragged;
var images = ['charger.svg', 'headphones.svg', 'keys.svg', 'laptop.svg', 'lunch.svg', 'mouse.svg', 'notebook.svg', 'pencilcase.svg', 'phone.svg', 'sketchbook.svg', 'umbrella.svg', 'waterbottle.svg'];
var newImg;

function getImg() {
  num =  Math.floor(Math.random() * images.length);
  console.log('num: ' + num);
  newImg = images.splice(num, 1)[0];
  console.log('setting new image to: ' + newImg);
  console.log('images length: ' + images.length);
}

document.addEventListener("dragstart", function(event) {
  var img = new Image();
  // store a ref. on the dragged elem
  dragged = event.target;
  event.dataTransfer.setData('text/plain', null);
  getImg();
  img.src = 'images/' + newImg;
  console.log('img: ' + img + img.src);
  event.dataTransfer.setDragImage(img, 10, 10);
}, false);

document.addEventListener("dragend", function(event) {
  // reset the transparency
  //event.target.style.opacity = "";
  if(images.length == 0) {
    dragged.draggable = 'false';
  }
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function(event) {
  // prevent default to allow drop
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function(event) {
  // highlight potential drop target when the draggable element enters it
  if (event.target.className == "dropzone") {
    event.target.style.background = "#E6E7E8";
  }

}, false);

document.addEventListener("dragleave", function(event) {
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className == "dropzone") {
    event.target.style.background = "";
  }

}, false);

document.addEventListener("drop", function(event) {
  // prevent default action (open as link for some elements)
  event.preventDefault();
  // move dragged elem to the selected drop target
  if (event.target.className == "dropzone") {
    event.target.style.background = "";
    //dragged.parentNode.removeChild( dragged );
    var nodeCopy = dragged.cloneNode(true);
    nodeCopy.id = '';
    nodeCopy.src = 'images/' + newImg;
    event.target.appendChild(nodeCopy);
  }

}, false);

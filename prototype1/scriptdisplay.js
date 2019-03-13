import {
  getLocal,
  startPan,
  endPan
} from 'https://theacalix.github.io/des157-g/prototype1/modulefunc.js';

// var storage = window.localStorage;
// var curTile,
//   rotateAmt,
//   initialX,
//   initialY,
//   offsetX = 0,
//   offsetY = 0;
const inner = document.querySelector('.inner');
// var view = document.querySelector('.view');
// var boxRect = document.querySelector('.box').getBoundingClientRect();
// var cols = inner.childElementCount * boxRect.width;
// var rows = document.querySelector('.row').childElementCount * boxRect.height;

window.addEventListener('load', getLocal);
inner.addEventListener('mousedown', startPan);
inner.addEventListener('mouseup', endPan);
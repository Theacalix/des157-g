// import {
//   getLocal,
//   startPan,
//   endPan
// } from '/des157-g/prototype2/modulefunc.js'; //for github
import {
  getLocal,
  startPan,
  endPan
} from '/modulefunc.js'; //for local

const inner = document.querySelector('.inner');

window.addEventListener('load', getLocal);
inner.addEventListener('mousedown', startPan);
inner.addEventListener('mouseup', endPan);

//var checking = setInterval(getLocal, 1000); //need to check that tile exists
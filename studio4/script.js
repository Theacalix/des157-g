// import { Droppable }  from 'https://cdn.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.8/lib/draggable.bundle.min.js';
// 'use strict';
// console.log('reading js');
//
// const droppable = new Droppable(document.querySelectorAll('section .inner'), {
//   draggable: '.tile',
//   dropzone: '.box',
//   mirror: {
//     constrainDimensions: true,
//   }
// });

var acc = document.querySelectorAll('.accordion');

for(var i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function() {
    var icon = this.firstChild;
    var panel = this.nextElementSibling;
    // console.log(icon);
    if( panel.style.display === 'flex') {
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

'use strict';
console.log('reading js');

document.querySelector('#enter').addEventListener('click', getResults);
document.querySelector('#clear').addEventListener('click', reset);

function getResults(evt) {
  evt.preventDefault();
  var results = document.querySelector('#results');
  var adj1 = document.querySelector('#adj1').value.toLowerCase();
  var person = document.querySelector('#person').value;
  var said = document.querySelector('#said').value.toLowerCase();
  var verb = document.querySelector('#verb').value.toLowerCase();
  var adj2 = document.querySelector('#adj2').value.toLowerCase();
  var weapon = document.querySelector('input[name="weapon"]:checked').id;
  var attack = 'Pulling out your ';

  person = person[0].toUpperCase() + person.slice(1); //cap first letter

  if(weapon === 'ax') {
    attack += '<strong>battle ax</strong>, you hack the <strong>' + adj2 +
      '</strong> monster into pieces';
  } else if (weapon === 'sword') {
    attack += '<strong>great sword</strong>, you run your sword through the <strong>' +
    adj2 + '</strong> monster';
  } else if (weapon === 'bow') {
    attack += '<strong>bow and arrow</strong>, you shoot the <strong>' + adj2 +
    '</strong> monster through its giant gleaming eye';
  } else if (weapon === 'staff') {
    attack += '<strong>magic staff</strong>, you blast the <strong>' + adj2 +
    '</strong> monster with an enormous fireball'
  }

  results.innerHTML = 'As you enter the house, a(n) <strong>' + adj1 +
    '</strong> light fills the room. Your eyes adjust and you see <strong>' + person +
    '</strong> suspended from the ceiling. "Watch out!" they <strong>' + said +
    '</strong>. You <strong>' + verb + '</strong> out of the way as a huge tenticle whips past you. ' +
    attack + ' and rescue <strong>' + person + '</strong>.';

  results.className ='show';
}

function reset() {
  document.querySelector('#results').className = 'hide';
}

console.log('reading js');
var x1, x2, x3, y1, y2;
var going_up = true;
var fish;
var dist_x = 75.0; //dist to move
var dist_y = 75.0;
var center_x = 400;
var center_y = 100;
var exponent = 2; //power exponent
var x = 0.0; //current pos
var y = 0.0;
var angle = 0.0;
var step = 0.04; //incriment (0-1)
var pct = 0.0; //percentage traveled
var next_time = 1000;
var up = false;
var mouse = false;
var wait = true;

function setup() {
  var myCanvas = createCanvas(800, 250);
  myCanvas.parent('mySketch');
  imageMode(CENTER);
  fish = loadImage("fish.png");
  x1 = 0;
  x2 = -20;
  x3 = 100;
  y1 = 0;
  y2 = 5;
}

function draw() {
  background('#028ABE');
  drawWave(x1, 20 + y1);
  drawWave(x3, 50); //backwards
  drawWave(x2, 80 + y2);
  drawWave(x3, 120 + y1);
  drawWave(x2, 150);
  drawWave(x1, 180 + y1);
  drawWave(x3, 220 + y2);
  //calc wave pos
  x1 = getXf(x1, 1);
  x2 = getXf(x2, 2);
  x3 = getXb(x3, 1);
  y1 = getY(x1, y1);
  y2 = getY(x1, y2);

  if (wait) { //wait after arc finishes
    waiting(); //check if waiting
  } else { //not waiting draw ellipse
    translate(x, y); //move to img center
    rotate(angle);
    image(fish, 0, 0);
  }

  calcCurve(); //calc new x and y pos
}

function drawWave(x, y) { //y vertical position, x horizontal shift
  noFill();
  stroke('#054280');
  strokeWeight(4);
  for (var i = x; i <= width + 100; i += 100) {
    bezier(i - 100, y, i - 90, y + 20, i - 10, y + 20, i, y);
  }
}

function getXf(x, speed) {
  if (x < 100) { //x incriment and reset
    x += speed;
  } else {
    x = 0;
  }
  return x;
}

function getXb(x, speed) {
  if (x > 0) { //x incriment and reset
    x -= speed;
  } else {
    x = 100;
  }
  return x;
}


function getY(x, y) { //incriments y up and down for gentle bounce
  if (x % 5 == 0) { //checks x to only change every 5 frames
    if (y > 10) {
      going_up = false;
      y--;
    } else if (going_up) {
      y++;
    } else if (y < 0) {
      going_up = true;
      y++;
    } else {
      y--;
    }
  }
  return y;
}

function waiting() {
  if (millis() > next_time) { //done waiting, reset for new arc
    wait = false;
    up = true;
    pct = 0.0;
    center_x = mouseX;
    center_y = mouseY;
    next_time = millis() + 1000;
  }
}

function calcCurve() {
  if (up) {
    pct += step;
    if (pct < 1.0) {
      //move towards center
      x = (center_x - dist_x) + (pct * dist_x);
      y = center_y + (pow(1 - pct, exponent) * dist_y);
      angle = pct * PI / 4;
    } else {
      up = false;
      pct = 0.0;
    }
  } else {
    pct += step;
    if (pct < 1.0) {
      //move away from center
      x = center_x + (pct * dist_x);
      y = center_y + (pow(pct, exponent) * dist_y);
      angle = PI / 4 + pct * PI / 4;
    } else {
      wait = true;
    }
  }
}

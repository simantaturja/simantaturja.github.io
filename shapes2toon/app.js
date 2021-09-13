const SIZE = 256;
let inputImg,
  inputCanvas,
  output,
  statusMsg,
  pix2pix,
  randomBtn,
  clearBtn,
  transferBtn,
  currentColor,
  currentStroke,
  isBack;

function setup() {
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class('border-box').parent('input');
  img = createGraphics(SIZE, SIZE);
  isBack = true;
  inputImg = loadImage('images/M5.png', drawImage);
  output = select('#output');
  statusMsg = select('#status');
  currentColor = color(0, 0, 255);
  currentStroke = 17;
  transferBtn = select('#transferBtn');
  clearBtn = select('#clearBtn');
  clearBtn.mousePressed(function () {
    clearCanvas();
    background(255, 255, 255);
    isBack = false;
  });

  randomBtn = select('#randomBtn');
  randomBtn.mousePressed(function () {
    isBack = true;
    let src = [
      'images/M1.png',
      'images/M5.png',
      'images/M80.png',
      'images/M232.png',
      'images/M277.png',
      'images/MM12.jpg',
      'images/MM47.png',
      'images/MM49.png'
    ];
    let index = int(random(0, 8));
    inputImg = loadImage(src[index], drawImage);
  });
  stroke(0);
  pixelDensity(1);

  // Create a pix2pix method with a pre-trained model
  pix2pix = ml5.pix2pix('model/faceonly_main_e90.pict', modelLoaded);
}
var x, y;
function draw() {
  console.log('hello');
  fill(255);
  noStroke();
  rect(0, 0, SIZE, SIZE);
  img.strokeCap(ROUND);
  strokeCap(PROJECT);
  thickness = 1;
  image(img, 0, 0);
  fill(255, 255, 255, 0);
  stroke(0, 0, 0);
  strokeWeight(thickness);
  img.fill(255, 255, 255, 0);
  img.stroke(0, 0, 0);
  img.strokeWeight(thickness);
  if (isBack) background(inputImg, 0, 0);
  if (x !== null) {
    ellipseTool();
  }
}
function modelLoaded() {
  statusMsg.html('Model Loaded!');
  transferBtn.mousePressed(function () {
    transfer();
  });
}
function drawImage() {
  image(img, 0, 0, SIZE, SIZE);
}

function clearCanvas() {
  background(255);
  img.background(255);
}
function mousePressed() {
  if (x == null) {
    if (onCanvas()) {
      x = mouseX;
      y = mouseY;
    }
  }
}

function touchStarted() {
  if (x == null) {
    if (onCanvas()) {
      x = mouseX;
      y = mouseY;
    }
  }
}

function touchEnded() {
  if (x != null) {
    img.ellipseMode(CORNERS);
    img.ellipse(x, y, mouseX, mouseY);
    x = null;
    y = null;
  }
}

function mouseReleased() {
  if (x != null) {
    img.ellipseMode(CORNERS);
    img.ellipse(x, y, mouseX, mouseY);
    x = null;
    y = null;
  }
}

function ellipseTool() {
  if (x !== null) {
    ellipseMode(CORNERS);
    ellipse(x, y, mouseX, mouseY);
  }
}

function onCanvas() {
  return mouseX >= 0 && mouseX <= SIZE && mouseY >= 0 && mouseY <= SIZE;
}

function transfer() {
  statusMsg.html('Transfering...');
  const canvasElement = select('canvas').elt;

  pix2pix.transfer(canvasElement, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result && result.src) {
      statusMsg.html('Done!');
      // Create an image based result
      output.elt.src = result.src;
    }
  });
}
